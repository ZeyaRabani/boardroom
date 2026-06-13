"use client";

import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import type { CompetitorMapData, Severity } from "@/lib/types";

const THREAT_COLOR: Record<Severity, string> = {
  low: "#38bdf8",
  medium: "#f59e0b",
  high: "#fb923c",
  critical: "#f43f5e",
};

function MapTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload as { name?: string } | undefined;
  if (!point?.name) return null;
  return (
    <div className="rounded-lg border border-white/15 bg-[#0b1020] px-2.5 py-1.5 text-xs text-white">
      {point.name}
    </div>
  );
}

export interface CompetitorMapProps {
  data: CompetitorMapData;
}

/** Placeholder — polish in sub-agent. */
export function CompetitorMap({ data }: CompetitorMapProps) {
  const competitors = data.competitors.map((c) => ({
    x: c.xAxis,
    y: c.yAxis,
    z: 120,
    name: c.name,
    color: THREAT_COLOR[c.threatLevel],
  }));
  const you = [{ x: data.you.xAxis, y: data.you.yAxis, z: 200, name: data.you.name }];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
        Competitive Landscape
      </h3>
      <div className="mt-2 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.1)" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 100]}
              name={data.xAxisLabel}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
              label={{ value: data.xAxisLabel, position: "bottom", fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 100]}
              name={data.yAxisLabel}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
              label={{ value: data.yAxisLabel, angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            />
            <ZAxis type="number" dataKey="z" range={[80, 220]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<MapTooltip />} />
            <Scatter data={competitors}>
              {competitors.map((c, i) => (
                <Cell key={i} fill={c.color} />
              ))}
            </Scatter>
            <Scatter data={you} fill="#a78bfa" shape="star" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-sm text-white/70">{data.insight}</p>
    </div>
  );
}

export default CompetitorMap;
