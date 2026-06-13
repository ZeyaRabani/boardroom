"use client";

import { AlertTriangle } from "lucide-react";
import { AGENTS, type Risk, type Severity } from "@/lib/types";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES: Record<Severity, string> = {
  low: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  high: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  critical: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

export interface RiskCardProps {
  risk: Risk;
}

/** Placeholder — polish in sub-agent. */
export function RiskCard({ risk }: RiskCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-rose-400" />
        <h4 className="flex-1 font-semibold text-white">{risk.title}</h4>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase",
            SEVERITY_STYLES[risk.severity],
          )}
        >
          {risk.severity}
        </span>
      </div>
      <p className="mt-2 text-sm text-white/70">{risk.description}</p>
      <p className="mt-2 text-xs text-white/60">
        <span className="font-medium text-white/80">Mitigation: </span>
        {risk.mitigation}
      </p>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-white/40">
        <span className="rounded-full bg-white/5 px-2 py-0.5">{risk.category}</span>
        <span>likelihood: {risk.likelihood}</span>
        <span className="ml-auto">— {AGENTS[risk.raisedBy].title}</span>
      </div>
    </div>
  );
}

export default RiskCard;
