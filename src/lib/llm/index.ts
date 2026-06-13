/**
 * Provider selection. Set LLM_PROVIDER to "vertex" | "gemini" | "mock".
 * When unset or "auto", we pick the first provider that has credentials and
 * fall back to the credential-free Mock provider so the app always runs.
 */

import { MockProvider } from "./mock";
import { createVertexProvider } from "./vertex";
import { createGeminiProvider } from "./gemini";
import type { LLMProvider } from "./types";

export type ProviderName = "vertex" | "gemini" | "mock" | "auto";

let cached: LLMProvider | null = null;

function build(): LLMProvider {
  const choice = (process.env.LLM_PROVIDER ?? "auto").toLowerCase() as ProviderName;

  const tryVertex = () => {
    try {
      return createVertexProvider();
    } catch {
      return null;
    }
  };
  const tryGemini = () => {
    try {
      return createGeminiProvider();
    } catch {
      return null;
    }
  };

  switch (choice) {
    case "vertex":
      return tryVertex() ?? new MockProvider();
    case "gemini":
      return tryGemini() ?? new MockProvider();
    case "mock":
      return new MockProvider();
    case "auto":
    default:
      return tryVertex() ?? tryGemini() ?? new MockProvider();
  }
}

/** Returns the active provider (cached for the lifetime of the server). */
export function getProvider(): LLMProvider {
  if (!cached) cached = build();
  return cached;
}

/** For tests / hot config changes. */
export function resetProvider(): void {
  cached = null;
}

export type { LLMProvider } from "./types";
