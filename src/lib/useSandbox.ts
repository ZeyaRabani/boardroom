"use client";

import { useCallback, useRef, useState } from "react";
import type { AgentStatus } from "./useBoard";
import {
  AGENT_ROLES,
  type AgentReaction,
  type AgentRole,
  type BoardAnalysis,
  type SandboxResult,
  type SandboxStreamEvent,
} from "./types";

/** Board-level impact of a change, without the per-member reactions. */
export type SandboxImpact = Omit<SandboxResult, "reactions" | "scenario">;

export interface SandboxState {
  /** Is a scenario currently being evaluated? */
  running: boolean;
  status: string;
  /** The scenario currently being evaluated (empty when idle). */
  scenario: string;
  reactionStatus: Record<AgentRole, AgentStatus>;
  /** Reactions for the in-flight scenario, as they stream in. */
  reactions: AgentReaction[];
  /** Board-level impact for the in-flight scenario (lands after reactions). */
  impact: SandboxImpact | null;
  /** Completed scenarios this session, newest last. */
  turns: SandboxResult[];
  error: string | null;
}

const idleStatus = (): Record<AgentRole, AgentStatus> =>
  AGENT_ROLES.reduce(
    (acc, r) => ({ ...acc, [r]: "idle" }),
    {} as Record<AgentRole, AgentStatus>,
  );

const initialState: SandboxState = {
  running: false,
  status: "",
  scenario: "",
  reactionStatus: idleStatus(),
  reactions: [],
  impact: null,
  turns: [],
  error: null,
};

export function useSandbox() {
  const [state, setState] = useState<SandboxState>(initialState);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState(initialState);
  }, []);

  const run = useCallback(
    async (
      scenarioText: string,
      ctx: { idea: string; analysis: BoardAnalysis },
    ) => {
      const scenario = scenarioText.trim();
      if (!scenario) return;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      // history = scenarios already applied this session, in order.
      let history: string[] = [];
      setState((s) => {
        history = s.turns.map((t) => t.scenario);
        return {
          ...s,
          running: true,
          status: "The board is reacting…",
          scenario,
          reactionStatus: idleStatus(),
          reactions: [],
          impact: null,
          error: null,
        };
      });

      const applyEvent = (event: SandboxStreamEvent) => {
        setState((s) => {
          switch (event.type) {
            case "status":
              return { ...s, status: event.message };
            case "reaction_start":
              return {
                ...s,
                reactionStatus: {
                  ...s.reactionStatus,
                  [event.role]: "thinking",
                },
              };
            case "reaction_done":
              return {
                ...s,
                reactionStatus: {
                  ...s.reactionStatus,
                  [event.reaction.role]: "done",
                },
                reactions: [
                  ...s.reactions.filter(
                    (r) => r.role !== event.reaction.role,
                  ),
                  event.reaction,
                ],
              };
            case "impact":
              return { ...s, impact: event.impact };
            case "complete":
              return {
                ...s,
                turns: [...s.turns, event.result],
                status: "",
              };
            case "error":
              return { ...s, error: event.message };
            default:
              return s;
          }
        });
      };

      try {
        const res = await fetch("/api/board/sandbox", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idea: ctx.idea,
            analysis: ctx.analysis,
            scenario,
            history,
          }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          throw new Error(`Sandbox failed (${res.status})`);
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              applyEvent(JSON.parse(trimmed) as SandboxStreamEvent);
            } catch {
              /* ignore partial/garbage line */
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setState((s) => ({
            ...s,
            error: err instanceof Error ? err.message : String(err),
          }));
        }
      } finally {
        setState((s) => ({ ...s, running: false, status: "" }));
      }
    },
    [],
  );

  return { state, run, reset };
}
