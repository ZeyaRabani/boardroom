"use client";

import { Sparkles, Clock, TrendingUp, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { AGENTS, type Impact, type Opportunity } from "@/lib/types";
import { cn } from "@/lib/utils";

const IMPACT_STYLES: Record<Impact, { badge: string; glow: string; bar: string }> = {
  low: {
    badge: "border-white/20 bg-white/5 text-white/60",
    glow: "shadow-none",
    bar: "from-white/30 to-white/20",
  },
  medium: {
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    bar: "from-emerald-400 to-teal-400",
  },
  high: {
    badge: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.25)]",
    bar: "from-emerald-300 to-teal-300",
  },
};

export interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const impact = IMPACT_STYLES[opportunity.impact];
  const agent = AGENTS[opportunity.raisedBy];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] p-5",
        impact.glow,
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-teal-500/[0.02]" />

      {/* Header */}
      <div className="relative flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <Sparkles className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-[15px] font-semibold text-white">
              {opportunity.title}
            </h4>
            <span
              className={cn(
                "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                impact.badge,
              )}
            >
              {opportunity.impact}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-white/40">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {opportunity.timeframe}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {opportunity.impact} impact
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="relative mt-3 text-[13px] leading-relaxed text-white/60">
        {opportunity.description}
      </p>

      {/* Confidence meter */}
      <div className="relative mt-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-white/40">
            Confidence
          </span>
          <span className="text-sm font-semibold text-white">
            {opportunity.confidence}
            <span className="text-white/40">%</span>
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${opportunity.confidence}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className={cn("h-full rounded-full bg-gradient-to-r", impact.bar)}
          />
        </div>
      </div>

      {/* Footer — agent attribution */}
      <div className="relative mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-3">
        <Eye className="h-3 w-3 text-white/30" />
        <span className="text-[11px] text-white/40">
          Spotted by{" "}
          <span className="font-medium" style={{ color: agent.accent }}>
            {agent.title}
          </span>
        </span>
      </div>
    </motion.div>
  );
}

export default OpportunityCard;
