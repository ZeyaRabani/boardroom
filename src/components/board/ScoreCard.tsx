"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { ScoreCardData, ScoreDimension, Verdict } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ---- verdict palette ---- */
const VERDICT_CONFIG: Record<
  Verdict,
  { label: string; color: string; bg: string; ring: string; glow: string }
> = {
  strong: {
    label: "Strong",
    color: "#34d399",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/25",
    glow: "shadow-[0_0_40px_rgba(52,211,153,0.12)]",
  },
  promising: {
    label: "Promising",
    color: "#38bdf8",
    bg: "bg-sky-500/10",
    ring: "ring-sky-500/25",
    glow: "shadow-[0_0_40px_rgba(56,189,248,0.12)]",
  },
  risky: {
    label: "Risky",
    color: "#fbbf24",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/25",
    glow: "shadow-[0_0_40px_rgba(251,191,36,0.12)]",
  },
  weak: {
    label: "Weak",
    color: "#f87171",
    bg: "bg-rose-500/10",
    ring: "ring-rose-500/25",
    glow: "shadow-[0_0_40px_rgba(248,113,113,0.12)]",
  },
};

/* ---- radial gauge (SVG ring) ---- */
function RadialGauge({ score, color }: { score: number; color: string }) {
  const r = 70;
  const circumference = 2 * Math.PI * r;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="168" height="168" viewBox="0 0 180 180">
        {/* track */}
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        {/* filled arc */}
        <motion.circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
          transform="rotate(-90 90 90)"
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      {/* center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-white/40">out of 100</span>
      </div>
    </div>
  );
}

/* ---- dimension bar ---- */
function DimensionRow({
  dim,
  accentColor,
  isActive,
  onHover,
}: {
  dim: ScoreDimension;
  accentColor: string;
  isActive: boolean;
  onHover: (label: string | null) => void;
}) {
  const pct = (dim.score / 10) * 100;
  return (
    <motion.div
      className="group/row cursor-default"
      onMouseEnter={() => onHover(dim.label)}
      onMouseLeave={() => onHover(null)}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between text-[12px]">
        <span
          className={cn(
            "font-medium transition-colors",
            isActive ? "text-white" : "text-white/60",
          )}
        >
          {dim.label}
        </span>
        <span className="tabular-nums text-white/50">{dim.score}/10</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accentColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        />
      </div>
      {/* rationale tooltip */}
      <div
        className={cn(
          "mt-1 overflow-hidden text-[11px] leading-snug text-white/40 transition-all duration-200",
          isActive ? "max-h-16 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {dim.rationale}
      </div>
    </motion.div>
  );
}

/* ---- main component ---- */
export interface ScoreCardProps {
  scorecard: ScoreCardData;
}

export function ScoreCard({ scorecard }: ScoreCardProps) {
  const [hoveredDim, setHoveredDim] = useState<string | null>(null);
  const v = VERDICT_CONFIG[scorecard.verdict];
  const radarData = scorecard.dimensions.map((d) => ({
    label: d.label,
    score: d.score,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] p-6",
        v.glow,
      )}
    >
      {/* background accent glow */}
      <div
        className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full opacity-[0.07] blur-3xl"
        style={{ backgroundColor: v.color }}
      />

      {/* header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-white/40" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
            Board Score
          </h3>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1",
            v.bg,
            v.ring,
          )}
          style={{ color: v.color }}
        >
          {v.label}
        </span>
      </div>

      {/* body: gauge + radar side by side */}
      <div className="relative mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* radial gauge */}
        <div className="flex flex-col items-center gap-2">
          <RadialGauge score={scorecard.overall} color={v.color} />
        </div>

        {/* radar chart */}
        <div className="h-52 w-full max-w-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="label"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
              />
              <Radar
                dataKey="score"
                stroke={v.color}
                fill={v.color}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* dimensions breakdown */}
      <div className="relative mt-6 space-y-2.5">
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/30">
          Dimensions
        </h4>
        {scorecard.dimensions.map((dim) => (
          <DimensionRow
            key={dim.label}
            dim={dim}
            accentColor={v.color}
            isActive={hoveredDim === dim.label}
            onHover={setHoveredDim}
          />
        ))}
      </div>

      {/* summary */}
      <div className="relative mt-5 border-t border-white/[0.06] pt-4">
        <p className="text-[13px] leading-relaxed text-white/55">
          {scorecard.summary}
        </p>
      </div>
    </motion.div>
  );
}

export default ScoreCard;
