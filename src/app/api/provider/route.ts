import { getProvider } from "@/lib/llm";

export const runtime = "nodejs";

/** GET -> which LLM provider is active (for the UI status badge). */
export function GET() {
  const provider = getProvider();
  return Response.json({ name: provider.name, live: provider.live });
}
