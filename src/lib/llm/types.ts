/**
 * Provider abstraction so the model can be swapped (Gemini via Vertex AI,
 * Gemini via AI Studio, or a credential-free mock for local dev / demos).
 *
 * Implementations live in this folder; `getProvider()` in ./index.ts selects
 * one from env. Everything else in the app depends only on this interface.
 */

import type { ZodType } from "zod";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GenerateJSONParams<T> {
  /** System / persona instructions. */
  system: string;
  /** The user-facing prompt (the idea + task). */
  prompt: string;
  /** Zod schema the parsed JSON must satisfy. */
  schema: ZodType<T>;
  /**
   * Human-readable description of the JSON shape (field names + meaning). The
   * provider injects this into the prompt so the model knows what to emit.
   */
  schemaHint: string;
  temperature?: number;
  maxOutputTokens?: number;
  /**
   * Optional caller hint identifying what is being generated (an agent role or
   * "synthesis"). Live providers ignore it; the mock uses it to pick the right
   * canned sample deterministically.
   */
  tag?: string;
}

export interface GenerateTextParams {
  system?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxOutputTokens?: number;
}

export interface LLMProvider {
  /** Stable id, e.g. "vertex", "gemini", "mock". */
  readonly name: string;
  /** True when the provider can actually reach a model (has creds). */
  readonly live: boolean;
  /** Generate a JSON object validated against `schema`. */
  generateJSON<T>(params: GenerateJSONParams<T>): Promise<T>;
  /** Generate free-form text (used for the copilot chat layer). */
  generateText(params: GenerateTextParams): Promise<string>;
}

/** Thrown when a provider is selected but cannot be initialised. */
export class ProviderUnavailableError extends Error {}
