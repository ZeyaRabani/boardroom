"use client";

import { Flag } from "lucide-react";
import type { MVPRoadmapData } from "@/lib/types";

export interface MVPRoadmapProps {
  roadmap: MVPRoadmapData;
}

/** Placeholder — polish in sub-agent. */
export function MVPRoadmap({ roadmap }: MVPRoadmapProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-2">
        <Flag className="h-4 w-4 text-indigo-300" />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
          MVP Roadmap
        </h3>
      </div>
      <p className="mt-1 text-sm text-white/80">
        <span className="font-medium">North star: </span>
        {roadmap.northStar}
      </p>
      <ol className="mt-4 space-y-4 border-l border-white/10 pl-5">
        {roadmap.phases.map((phase) => (
          <li key={phase.id} className="relative">
            <span className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-indigo-400 ring-4 ring-indigo-400/20" />
            <div className="flex items-baseline justify-between">
              <h4 className="font-semibold text-white">{phase.name}</h4>
              <span className="text-xs text-white/40">{phase.timeframe}</span>
            </div>
            <p className="text-sm text-white/60">{phase.goal}</p>
            <ul className="mt-2 list-disc space-y-0.5 pl-4 text-sm text-white/70">
              {phase.tasks.map((t, i) => (
                <li key={i}>{t.title}</li>
              ))}
            </ul>
            <p className="mt-1 text-xs text-emerald-300/80">→ {phase.outcome}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default MVPRoadmap;
