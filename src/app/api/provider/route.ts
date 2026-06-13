import { getProvider } from "@/lib/llm";

export const runtime = "nodejs";

/** GET -> which LLM provider is active (for the UI status badge). */
export function GET() {
  const provider = getProvider();
  // The CopilotKit chat layer only has a usable agent when a Gemini chat key
  // is configured; without one the runtime registers no agent, so the chat UI
  // must not mount. The board canvas works regardless of this flag.
  const chat = Boolean(process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY);
  return Response.json({ name: provider.name, live: provider.live, chat });
}
