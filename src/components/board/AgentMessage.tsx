"use client";

import { AGENTS, type AgentAnalysis, type AgentMessageStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STANCE_STYLES: Record<AgentAnalysis["stance"], string> = {
  bullish: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  neutral: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  bearish: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
};

export interface AgentMessageProps {
  analysis: AgentAnalysis;
  status?: AgentMessageStatus;
}

/** A single board member's spoken turn. Placeholder — polish in sub-agent. */
export function AgentMessage({ analysis, status = "done" }: AgentMessageProps) {
  const profile = AGENTS[analysis.role];
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
        style={{ backgroundColor: `${profile.accent}22`, border: `1px solid ${profile.accent}55` }}
        aria-hidden
      >
        {profile.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{profile.name}</span>
          <span className="text-xs text-white/50">{profile.title}</span>
          <span
            className={cn(
              "ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1",
              STANCE_STYLES[analysis.stance],
            )}
          >
            {analysis.stance}
          </span>
        </div>
        <p className="mt-1 text-sm font-medium text-white/90">{analysis.headline}</p>
        {status === "thinking" ? (
          <p className="mt-1 text-sm italic text-white/40">thinking…</p>
        ) : (
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-white/70">
            {analysis.analysis}
          </p>
        )}
      </div>
    </div>
  );
}

export default AgentMessage;
