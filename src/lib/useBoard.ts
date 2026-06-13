"use client";

import { useCallback, useRef, useState } from "react";
import {
  AGENT_ROLES,
  type AgentAnalysis,
  type AgentRole,
  type BoardAnalysis,
  type BoardStreamEvent,
  type BoardSynthesis,
  type CompetitorMapData,
  type MVPRoadmapData,
  type ScoreCardData,
} from "./types";

export type AgentStatus = "idle" | "thinking" | "done";

export interface BoardState {
  idea: string;
  running: boolean;
  status: string;
  agentStatus: Record<AgentRole, AgentStatus>;
  messages: AgentAnalysis[];
  scorecard: ScoreCardData | null;
  competitorMap: CompetitorMapData | null;
  roadmap: MVPRoadmapData | null;
  analysis: BoardAnalysis | null;
  error: string | null;
  synthesizing: boolean;
  synthesis: BoardSynthesis | null;
}

const idleStatus = (): Record<AgentRole, AgentStatus> =>
  AGENT_ROLES.reduce(
    (acc, r) => ({ ...acc, [r]: "idle" }),
    {} as Record<AgentRole, AgentStatus>,
  );

const initialState: BoardState = {
  idea: "",
  running: false,
  status: "",
  agentStatus: idleStatus(),
  messages: [],
  scorecard: null,
  competitorMap: null,
  roadmap: null,
  analysis: null,
  error: null,
  synthesizing: false,
  synthesis: null,
};

export function useBoard() {
  const [state, setState] = useState<BoardState>(initialState);
  const abortRef = useRef<AbortController | null>(null);

  const setIdea = useCallback((idea: string) => {
    setState((s) => ({ ...s, idea }));
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState(initialState);
  }, []);

  const applyEvent = useCallback((event: BoardStreamEvent) => {
    setState((s) => {
      switch (event.type) {
        case "status":
          return { ...s, status: event.message };
        case "agent_start":
          return {
            ...s,
            agentStatus: { ...s.agentStatus, [event.role]: "thinking" },
          };
        case "agent_done":
          return {
            ...s,
            agentStatus: { ...s.agentStatus, [event.analysis.role]: "done" },
            messages: [
              ...s.messages.filter((m) => m.role !== event.analysis.role),
              event.analysis,
            ],
          };
        case "scorecard":
          return { ...s, scorecard: event.scorecard };
        case "competitor_map":
          return { ...s, competitorMap: event.competitorMap };
        case "roadmap":
          return { ...s, roadmap: event.roadmap };
        case "complete":
          return { ...s, analysis: event.analysis, status: "" };
        case "error":
          return { ...s, error: event.message };
        default:
          return s;
      }
    });
  }, []);

  const analyze = useCallback(
    async (ideaText: string) => {
      const idea = ideaText.trim();
      if (!idea) return;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({
        ...initialState,
        idea,
        running: true,
        status: "Convening the board…",
      });

      try {
        const res = await fetch("/api/board/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          throw new Error(`Analyze failed (${res.status})`);
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
              applyEvent(JSON.parse(trimmed) as BoardStreamEvent);
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
    [applyEvent],
  );

  const synthesize = useCallback(
    async (question = "What should I build this weekend to prove this?") => {
      let current: BoardState | null = null;
      setState((s) => {
        current = s;
        return { ...s, synthesizing: true };
      });
      const snapshot = current as unknown as BoardState;
      if (!snapshot?.analysis) {
        setState((s) => ({ ...s, synthesizing: false }));
        return null;
      }
      try {
        const res = await fetch("/api/board/synthesize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idea: snapshot.idea,
            analysis: snapshot.analysis,
            question,
          }),
        });
        if (!res.ok) throw new Error(`Synthesize failed (${res.status})`);
        const synthesis = (await res.json()) as BoardSynthesis;
        setState((s) => ({ ...s, synthesis, synthesizing: false }));
        return synthesis;
      } catch (err) {
        setState((s) => ({
          ...s,
          synthesizing: false,
          error: err instanceof Error ? err.message : String(err),
        }));
        return null;
      }
    },
    [],
  );

  return { state, setIdea, analyze, synthesize, reset };
}
