import { runStrategicSandbox } from "@/lib/agents";
import type { BoardAnalysis, SandboxStreamEvent } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST { idea, analysis, scenario, history? } -> newline-delimited JSON stream
 * of SandboxStreamEvent. Each board member reacts to the proposed change, then
 * the board-level impact (winners/losers/tradeoffs/second-order) lands.
 */
export async function POST(req: Request) {
  let body: {
    idea?: unknown;
    analysis?: unknown;
    scenario?: unknown;
    history?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return new Response("invalid JSON body", { status: 400 });
  }

  const { idea, analysis, scenario, history } = body;
  if (typeof idea !== "string" || idea.trim().length === 0) {
    return new Response("`idea` (string) is required", { status: 400 });
  }
  if (typeof scenario !== "string" || scenario.trim().length === 0) {
    return new Response("`scenario` (string) is required", { status: 400 });
  }
  if (!analysis || typeof analysis !== "object") {
    return new Response("`analysis` (BoardAnalysis) is required", { status: 400 });
  }
  const historyList = Array.isArray(history)
    ? history.filter((h): h is string => typeof h === "string")
    : [];

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: SandboxStreamEvent) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      try {
        await runStrategicSandbox({
          idea,
          analysis: analysis as BoardAnalysis,
          scenario,
          history: historyList,
          options: { onEvent: send },
        });
      } catch (err) {
        send({
          type: "error",
          message: err instanceof Error ? err.message : String(err),
        });
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
