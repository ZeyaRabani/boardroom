"use client";

import { motion } from "framer-motion";
import { Crosshair, ShieldAlert } from "lucide-react";
import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
} from "recharts";
import type { CompetitorMapData, Severity } from "@/lib/types";
import { cn } from "@/lib/utils";

const THREAT_COLOR: Record<Severity, string> = {
  low: "#38bdf8",
  medium: "#f59e0b",
  high: "#fb923c",
  critical: "#f43f5e",
};

const THREAT_LABEL: Record<Severity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

interface CompetitorPoint {
  x: number;
  y: number;
  z: number;
  name: string;
  description?: string;
  strength?: string;
  weakness?: string;
  threatLevel?: Severity;
  color: string;
  isYou?: boolean;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: CompetitorPoint }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="rounded-xl border border-white/15 bg-[#0b1020]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {point.isYou ? (
          <span className="text-xs font-bold text-violet-400">★ YOU</span>
        ) : (
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: point.color }}
          />
        )}
        <span className="text-sm font-semibold text-white">{point.name}</span>
      </div>
      {point.strength && (
        <p className="mt-1.5 text-xs text-white/60">
          <span className="font-medium text-emerald-400">+</span> {point.strength}
        </p>
      )}
      {point.weakness && (
        <p className="mt-0.5 text-xs text-white/60">
          <span className="font-medium text-rose-400">−</span> {point.weakness}
        </p>
      )}
      {point.threatLevel && !point.isYou && (
        <p className="mt-1 text-xs" style={{ color: THREAT_COLOR[point.threatLevel] }}>
          Threat: {THREAT_LABEL[point.threatLevel]}
        </p>
      )}
    </div>
  );
}

export interface CompetitorMapProps {
  data: CompetitorMapData;
}

export function CompetitorMap({ data }: CompetitorMapProps) {
  const competitors: CompetitorPoint[] = data.competitors.map((c) => ({
    x: c.xAxis,
    y: c.yAxis,
    z: 140,
    name: c.name,
    description: c.description,
    strength: c.strength,
    weakness: c.weakness,
    threatLevel: c.threatLevel,
    color: THREAT_COLOR[c.threatLevel],
  }));

  const you: CompetitorPoint[] = [
    {
      x: data.you.xAxis,
      y: data.you.yAxis,
      z: 220,
      name: data.you.name,
      color: "#a78bfa",
      isYou: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1020] to-[#0d0f1a] p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
          <Crosshair className="h-4 w-4 text-red-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">
            Competitive Landscape
          </h3>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 10 }}>
            <CartesianGrid
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="3 3"
            />
            {/* Quadrant reference lines */}
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 100]}
              name={data.xAxisLabel}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
              label={{
                value: data.xAxisLabel,
                position: "bottom",
                fill: "rgba(255,255,255,0.5)",
                fontSize: 11,
                offset: 10,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 100]}
              name={data.yAxisLabel}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
              label={{
                value: data.yAxisLabel,
                angle: -90,
                position: "insideLeft",
                fill: "rgba(255,255,255,0.5)",
                fontSize: 11,
                offset: 0,
              }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 280]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(255,255,255,0.15)", strokeDasharray: "4 4" }}
            />
            {/* Competitor bubbles */}
            <Scatter data={competitors} name="Competitors">
              {competitors.map((c, i) => (
                <Cell
                  key={i}
                  fill={c.color}
                  fillOpacity={0.75}
                  stroke={c.color}
                  strokeWidth={1}
                />
              ))}
            </Scatter>
            {/* Your position */}
            <Scatter data={you} name="You" shape="star" fill="#a78bfa">
              {you.map((_, i) => (
                <Cell
                  key={i}
                  fill="#a78bfa"
                  fillOpacity={1}
                  stroke="#7c3aed"
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-violet-400">★</span>
          <span className="text-xs text-white/50">You</span>
        </div>
        {(Object.keys(THREAT_COLOR) as Severity[]).map((level) => (
          <div key={level} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: THREAT_COLOR[level] }}
            />
            <span className="text-xs capitalize text-white/50">{level}</span>
          </div>
        ))}
      </div>

      {/* Competitor list */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {data.competitors.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
            className={cn(
              "rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5",
              "hover:border-white/10 hover:bg-white/[0.04] transition-colors"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">{c.name}</span>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                style={{
                  color: THREAT_COLOR[c.threatLevel],
                  backgroundColor: `${THREAT_COLOR[c.threatLevel]}15`,
                }}
              >
                <ShieldAlert className="h-2.5 w-2.5" />
                {c.threatLevel}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-white/50">{c.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Insight */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] px-3.5 py-2.5 text-sm leading-relaxed text-white/70"
      >
        💡 {data.insight}
      </motion.p>
    </motion.div>
  );
}

export default CompetitorMap;
