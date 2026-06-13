"use client";

import { AlertTriangle, CheckCircle2, FileText, ListChecks } from "lucide-react";
import type { BoardMemoData, Recommendation } from "@/lib/types";
import { cn } from "@/lib/utils";

const REC_STYLES: Record<Recommendation, string> = {
  invest: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  explore: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  pivot: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  pass: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
};

export interface BoardMemoProps {
  memo: BoardMemoData;
}

/** Placeholder — polish in sub-agent. */
export function BoardMemo({ memo }: BoardMemoProps) {
  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/[0.08] to-white/[0.02] p-6">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-indigo-300" />
        <h3 className="flex-1 text-lg font-semibold text-white">{memo.title}</h3>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1",
            REC_STYLES[memo.recommendation],
          )}
        >
          {memo.recommendation}
        </span>
      </div>
      {memo.date && <p className="mt-0.5 text-xs text-white/40">{memo.date}</p>}

      <p className="mt-4 text-sm leading-relaxed text-white/80">{memo.thesis}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-rose-300/80">
            <AlertTriangle className="h-3.5 w-3.5" /> Key risks
          </h4>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-white/70">
            {memo.keyRisks.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-300/80">
            <CheckCircle2 className="h-3.5 w-3.5" /> Key opportunities
          </h4>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-white/70">
            {memo.keyOpportunities.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/60">
          <ListChecks className="h-3.5 w-3.5" /> Conditions to back it
        </h4>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-white/70">
          {memo.conditions.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/50">
            Verdict
          </span>
          <span className="text-xs text-white/50">{memo.confidence}% confidence</span>
        </div>
        <p className="mt-1 text-sm text-white/85">{memo.verdict}</p>
      </div>
    </div>
  );
}

export default BoardMemo;
