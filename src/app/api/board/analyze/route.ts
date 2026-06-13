import { runBoardAnalysis } from "@/lib/agents";
import type { BoardStreamEvent } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

/** POST { idea } -> newline-delimited JSON stream of BoardStreamEvent. */
export async function POST(req: Request) {
  let idea: unknown;
  try {
    ({ idea } = await req.json());
  } catch {
    return new Response("invalid JSON body", { status: 400 });
  }
  if (typeof idea !== "string" || idea.trim().length === 0) {
    return new Response("`idea` (string) is required", { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: BoardStreamEvent) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      try {
        await runBoardAnalysis(idea as string, { onEvent: send });
      } catch (err) {
        send({ type: "error", message: err instanceof Error ? err.message : String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
