"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { ScoreCardData, Verdict } from "@/lib/types";
import { cn } from "@/lib/utils";

const VERDICT_STYLES: Record<Verdict, string> = {
  strong: "text-emerald-300",
  promising: "text-sky-300",
  risky: "text-amber-300",
  weak: "text-rose-300",
};

export interface ScoreCardProps {
  scorecard: ScoreCardData;
}

/** Placeholder — polish in sub-agent. */
export function ScoreCard({ scorecard }: ScoreCardProps) {
  const data = scorecard.dimensions.map((d) => ({ label: d.label, score: d.score }));
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
          Board Score
        </h3>
        <span className={cn("text-sm font-semibold capitalize", VERDICT_STYLES[scorecard.verdict])}>
          {scorecard.verdict}
        </span>
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-5xl font-bold text-white">{scorecard.overall}</span>
        <span className="mb-1 text-white/40">/ 100</span>
      </div>
      <div className="mt-2 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid stroke="rgba(255,255,255,0.15)" />
            <PolarAngleAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} />
            <Radar dataKey="score" stroke="#818cf8" fill="#818cf8" fillOpacity={0.45} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-sm text-white/70">{scorecard.summary}</p>
    </div>
  );
}

export default ScoreCard;
