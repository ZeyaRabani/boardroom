import { runBoardSynthesis } from "@/lib/agents";
import type { BoardAnalysis } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

/** POST { idea, analysis, question? } -> BoardSynthesis (memo + action plan). */
export async function POST(req: Request) {
  let body: { idea?: string; analysis?: BoardAnalysis; question?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("invalid JSON body", { status: 400 });
  }
  if (!body.idea || !body.analysis) {
    return new Response("`idea` and `analysis` are required", { status: 400 });
  }
  try {
    const synthesis = await runBoardSynthesis({
      idea: body.idea,
      analysis: body.analysis,
      question:
        body.question ?? "What should I build this weekend to prove this?",
    });
    return Response.json(synthesis);
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
