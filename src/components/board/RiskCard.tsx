"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { AGENTS, type Risk, type Severity, type Likelihood } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ── severity palette ────────────────────────────────────────────────────── */

const SEVERITY_CFG: Record<Severity, { badge: string; accent: string; icon: string; glow: string }> = {
  low: {
    badge: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
    accent: "#0ea5e9",
    icon: "text-sky-400",
    glow: "0 0 20px 0 rgba(14,165,233,0.08)",
  },
  medium: {
    badge: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
    accent: "#f59e0b",
    icon: "text-amber-400",
    glow: "0 0 20px 0 rgba(245,158,11,0.08)",
  },
  high: {
    badge: "bg-orange-500/15 text-orange-300 ring-orange-500/30",
    accent: "#f97316",
    icon: "text-orange-400",
    glow: "0 0 20px 0 rgba(249,115,22,0.10)",
  },
  critical: {
    badge: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
    accent: "#ef4444",
    icon: "text-rose-400",
    glow: "0 0 20px 0 rgba(239,68,68,0.12)",
  },
};

const LIKELIHOOD_BADGE: Record<Likelihood, string> = {
  low: "bg-white/5 text-white/40 ring-white/10",
  medium: "bg-amber-500/10 text-amber-300/70 ring-amber-500/20",
  high: "bg-rose-500/10 text-rose-300/70 ring-rose-500/20",
};

/* ── main export ─────────────────────────────────────────────────────────── */

export interface RiskCardProps {
  risk: Risk;
}

export function RiskCard({ risk }: RiskCardProps) {
  const cfg = SEVERITY_CFG[risk.severity];
  const raiser = AGENTS[risk.raisedBy];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.008, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]/90 p-5"
        style={{ boxShadow: cfg.glow }}
      >
        {/* top accent bar */}
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ backgroundColor: cfg.accent }}
        />

        {/* ── header ──────────────────────────────────────────────── */}
        <div className="flex items-start gap-3">
          {/* icon container */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{
              background: `${cfg.accent}15`,
              border: `1px solid ${cfg.accent}30`,
            }}
          >
            <AlertTriangle className={cn("h-4 w-4", cfg.icon)} />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-[14px] font-semibold leading-snug text-white">
              {risk.title}
            </h4>

            {/* badge row */}
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {/* severity */}
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-px text-[10px] font-semibold uppercase tracking-wider ring-1",
                  cfg.badge,
                )}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: cfg.accent }}
                />
                {risk.severity}
              </span>

              {/* likelihood */}
              <span
                className={cn(
                  "rounded-full px-2 py-px text-[10px] font-medium uppercase tracking-wider ring-1",
                  LIKELIHOOD_BADGE[risk.likelihood],
                )}
              >
                {risk.likelihood} likelihood
              </span>

              {/* category tag */}
              <span className="rounded-full bg-white/5 px-2 py-px text-[10px] font-medium text-white/40 ring-1 ring-white/10">
                {risk.category}
              </span>
            </div>
          </div>
        </div>

        {/* ── description ─────────────────────────────────────────── */}
        <p className="mt-3.5 text-[13px] leading-relaxed text-white/60">
          {risk.description}
        </p>

        {/* ── mitigation callout ──────────────────────────────────── */}
        <div
          className="mt-3.5 rounded-xl border px-3.5 py-3"
          style={{
            backgroundColor: `${cfg.accent}08`,
            borderColor: `${cfg.accent}20`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: cfg.accent }}
            />
            <span
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: `${cfg.accent}cc` }}
            >
              Mitigation
            </span>
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-white/55">
            {risk.mitigation}
          </p>
        </div>

        {/* ── footer attribution ──────────────────────────────────── */}
        <div className="mt-3.5 flex items-center gap-2">
          <div
            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
            style={{
              background: `${raiser.accent}20`,
              border: `1px solid ${raiser.accent}40`,
            }}
            aria-hidden
          >
            {raiser.emoji}
          </div>
          <span className="text-[11px] text-white/35">
            Raised by{" "}
            <span className="font-medium text-white/50">{raiser.title}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default RiskCard;
