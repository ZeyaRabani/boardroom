/**
 * Shared Gemini implementation used by both the Vertex AI and AI Studio
 * providers — they differ only in how the `GoogleGenAI` client is constructed.
 */

import { GoogleGenAI } from "@google/genai";
import type {
  GenerateJSONParams,
  GenerateTextParams,
  LLMProvider,
} from "./types";

const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

/** Pull the first JSON object/array out of a model response. */
function extractJSON(raw: string): string {
  let s = raw.trim();
  // Strip ```json ... ``` fences if present.
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  const firstObj = s.indexOf("{");
  const firstArr = s.indexOf("[");
  const start =
    firstArr === -1
      ? firstObj
      : firstObj === -1
        ? firstArr
        : Math.min(firstObj, firstArr);
  if (start === -1) return s;
  const open = s[start];
  const close = open === "{" ? "}" : "]";
  const end = s.lastIndexOf(close);
  return end > start ? s.slice(start, end + 1) : s.slice(start);
}

export class GoogleGenAIProvider implements LLMProvider {
  readonly name: string;
  readonly live = true;
  private client: GoogleGenAI;
  private model: string;

  constructor(opts: { name: string; client: GoogleGenAI; model?: string }) {
    this.name = opts.name;
    this.client = opts.client;
    this.model = opts.model ?? DEFAULT_MODEL;
  }

  async generateJSON<T>(params: GenerateJSONParams<T>): Promise<T> {
    const system =
      `${params.system}\n\n` +
      `Respond with a SINGLE valid JSON value and nothing else — no prose, no ` +
      `markdown fences. The JSON must match this shape:\n${params.schemaHint}`;

    let lastErr: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await this.client.models.generateContent({
        model: this.model,
        contents: params.prompt,
        config: {
          systemInstruction: system,
          temperature: params.temperature ?? 0.6,
          maxOutputTokens: params.maxOutputTokens ?? 4096,
          responseMimeType: "application/json",
        },
      });
      const text = res.text ?? "";
      try {
        const parsed = JSON.parse(extractJSON(text));
        return params.schema.parse(parsed);
      } catch (err) {
        lastErr = err;
        // On retry, lower temperature and be more emphatic.
        params = { ...params, temperature: 0 };
      }
    }
    throw new Error(
      `[${this.name}] failed to produce valid JSON: ${String(lastErr)}`,
    );
  }

  async generateText(params: GenerateTextParams): Promise<string> {
    const contents = params.messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const res = await this.client.models.generateContent({
      model: this.model,
      contents,
      config: {
        systemInstruction: params.system,
        temperature: params.temperature ?? 0.7,
        maxOutputTokens: params.maxOutputTokens ?? 2048,
      },
    });
    return res.text ?? "";
  }
}
