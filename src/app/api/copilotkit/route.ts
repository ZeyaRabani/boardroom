import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
  type CopilotServiceAdapter,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

// Keep the architecture simple — no external services beyond the Gemini API.
// Opt out of CopilotKit's anonymous telemetry unless explicitly re-enabled.
process.env.COPILOTKIT_TELEMETRY_DISABLED ??= "true";

/**
 * Chat layer adapter. Uses Gemini (AI Studio key) when available so the copilot
 * can drive generative UI via tool calls; otherwise an empty adapter keeps the
 * app running in demo mode (the board canvas still works via /api/board/*).
 */
function makeAdapter(): CopilotServiceAdapter {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (apiKey) {
    return new GoogleGenerativeAIAdapter({
      model: process.env.GEMINI_CHAT_MODEL ?? "gemini-2.5-flash",
      apiVersion: "v1beta",
      apiKey,
    });
  }
  return new ExperimentalEmptyAdapter();
}

const copilotRuntime = new CopilotRuntime();
const serviceAdapter = makeAdapter();

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime: copilotRuntime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });
  return handleRequest(req);
};
