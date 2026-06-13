/**
 * Gemini via the Google AI Studio API (single API key — the easy local path).
 * Set GEMINI_API_KEY (or GOOGLE_API_KEY). Get one at https://aistudio.google.com.
 */

import { GoogleGenAI } from "@google/genai";
import { GoogleGenAIProvider } from "./google";
import { ProviderUnavailableError } from "./types";

export function createGeminiProvider(): GoogleGenAIProvider {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new ProviderUnavailableError(
      "Gemini provider requires GEMINI_API_KEY (or GOOGLE_API_KEY).",
    );
  }
  const client = new GoogleGenAI({ apiKey });
  return new GoogleGenAIProvider({ name: "gemini", client });
}
