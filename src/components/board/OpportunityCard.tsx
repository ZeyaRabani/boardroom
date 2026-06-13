"use client";

import { Sparkles } from "lucide-react";
import { AGENTS, type Impact, type Opportunity } from "@/lib/types";
import { cn } from "@/lib/utils";

const IMPACT_STYLES: Record<Impact, string> = {
  low: "border-white/20 bg-white/5 text-white/70",
  medium: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  high: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
};

export interface OpportunityCardProps {
  opportunity: Opportunity;
}

/** Placeholder — polish in sub-agent. */
export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-emerald-400" />
        <h4 className="flex-1 font-semibold text-white">{opportunity.title}</h4>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase",
            IMPACT_STYLES[opportunity.impact],
          )}
        >
          {opportunity.impact} impact
        </span>
      </div>
      <p className="mt-2 text-sm text-white/70">{opportunity.description}</p>
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-white/40">
          <span>{opportunity.timeframe}</span>
          <span>{opportunity.confidence}% confidence</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400"
            style={{ width: `${opportunity.confidence}%` }}
          />
        </div>
        <p className="mt-2 text-right text-[11px] text-white/40">
          — {AGENTS[opportunity.raisedBy].title}
        </p>
      </div>
    </div>
  );
}

export default OpportunityCard;
