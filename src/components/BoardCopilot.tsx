"use client";

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { ActionPlan, BoardMemo } from "@/components/board";
import type { useBoard } from "@/lib/useBoard";

/**
 * Registers the board state + actions with CopilotKit so the chat copilot can
 * convene the board and draft the weekend plan, rendering generative UI in-chat.
 * Renders nothing itself.
 */
export function BoardCopilot({ board }: { board: ReturnType<typeof useBoard> }) {
  const { state, analyze, synthesize } = board;

  useCopilotReadable({
    description: "The startup idea currently under evaluation by the board.",
    value: state.idea || "(none yet)",
  });

  useCopilotReadable({
    description: "The board's overall score and verdict, if analyzed.",
    value: state.scorecard
      ? { overall: state.scorecard.overall, verdict: state.scorecard.verdict }
      : "Not analyzed yet.",
  });

  useCopilotReadable({
    description: "Each board member's stance and one-line headline.",
    value: state.messages.map((m) => ({
      role: m.role,
      stance: m.stance,
      headline: m.headline,
    })),
  });

  useCopilotAction({
    name: "conveneBoard",
    description:
      "Convene the five-agent board (VC, CFO, CTO, Customer, Competitor) to " +
      "analyze a startup idea. Call this when the user shares an idea to evaluate.",
    parameters: [
      {
        name: "idea",
        type: "string",
        description: "The startup idea to evaluate.",
        required: true,
      },
    ],
    handler: async ({ idea }) => {
      await analyze(idea);
      return "The board has finished. Risk cards, scores, the competitor map, and the MVP roadmap are on the canvas.";
    },
  });

  useCopilotAction({
    name: "draftWeekendPlan",
    description:
      "Produce the final board memo and a concrete weekend action plan that " +
      "answers 'what should I build this weekend to prove this?'. The board must " +
      "have analyzed an idea first.",
    parameters: [
      {
        name: "question",
        type: "string",
        description: "The founder's question to the board.",
        required: false,
      },
    ],
    handler: async ({ question }) => {
      const result = await synthesize(question || undefined);
      return result
        ? "The board memo and weekend action plan are ready."
        : "Convene the board on an idea first.";
    },
    render: ({ status }) => {
      if (status === "executing" || state.synthesizing) {
        return (
          <div className="text-sm text-white/60">
            The board is drafting its memo and action plan…
          </div>
        );
      }
      if (state.synthesis) {
        return (
          <div className="space-y-3">
            <BoardMemo memo={state.synthesis.memo} />
            <ActionPlan plan={state.synthesis.actionPlan} />
          </div>
        );
      }
      return <div className="text-sm text-white/60">Preparing…</div>;
    },
  });

  return null;
}
