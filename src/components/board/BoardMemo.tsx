"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  ListChecks,
  TrendingUp,
} from "lucide-react";
import type { BoardMemoData, Recommendation } from "@/lib/types";
import { cn } from "@/lib/utils";

const REC_CONFIG: Record<
  Recommendation,
  { bg: string; text: string; ring: string; glow: string; label: string }
> = {
  invest: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    ring: "ring-emerald-500/40",
    glow: "shadow-emerald-500/20",
    label: "INVEST",
  },
  explore: {
    bg: "bg-sky-500/15",
    text: "text-sky-300",
    ring: "ring-sky-500/40",
    glow: "shadow-sky-500/20",
    label: "EXPLORE",
  },
  pivot: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    ring: "ring-amber-500/40",
    glow: "shadow-amber-500/20",
    label: "PIVOT",
  },
  pass: {
    bg: "bg-rose-500/15",
    text: "text-rose-300",
    ring: "ring-rose-500/40",
    glow: "shadow-rose-500/20",
    label: "PASS",
  },
};

const REC_ACCENT: Record<Recommendation, string> = {
  invest: "#10b981",
  explore: "#0ea5e9",
  pivot: "#f59e0b",
  pass: "#ef4444",
};

export interface BoardMemoProps {
  memo: BoardMemoData;
}

export function BoardMemo({ memo }: BoardMemoProps) {
  const rec = REC_CONFIG[memo.recommendation];
  const accent = REC_ACCENT[memo.recommendation];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] p-0"
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      <div className="p-6 pb-0">
        {/* Document header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${accent}15` }}
            >
              <FileText className="h-5 w-5" style={{ color: accent }} />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">
                {memo.title}
              </h3>
              {memo.date && (
                <p className="mt-0.5 text-xs text-white/40">{memo.date}</p>
              )}
            </div>
          </div>

          {/* Recommendation stamp */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-bold uppercase tracking-wider ring-1 shadow-lg",
              rec.bg,
              rec.text,
              rec.ring,
              rec.glow,
            )}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            {rec.label}
          </motion.div>
        </div>

        {/* Thesis */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
            Thesis
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/85">
            {memo.thesis}
          </p>
        </motion.div>

        {/* Two-column: Risks vs Opportunities */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-rose-500/10 bg-rose-500/[0.03] p-4"
          >
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              Key Risks
            </h4>
            <ul className="mt-3 space-y-2">
              {memo.keyRisks.map((r, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-start gap-2 text-sm text-white/70"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-400/60" />
                  {r}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4"
          >
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Key Opportunities
            </h4>
            <ul className="mt-3 space-y-2">
              {memo.keyOpportunities.map((o, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-start gap-2 text-sm text-white/70"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400/60" />
                  {o}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Conditions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4"
        >
          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50">
            <ListChecks className="h-3.5 w-3.5" />
            Conditions to Succeed
          </h4>
          <ul className="mt-3 space-y-2">
            {memo.conditions.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-white/70"
              >
                <span
                  className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded text-[10px] font-bold"
                  style={{ backgroundColor: `${accent}20`, color: accent }}
                >
                  {i + 1}
                </span>
                {c}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Footer: Verdict + Confidence */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 border-t border-white/5 bg-white/[0.01] p-6"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">
            Final Verdict
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-white/50">
              Confidence
            </span>
            <div className="relative h-2 w-24 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${memo.confidence}%` }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ backgroundColor: accent }}
              />
            </div>
            <span
              className="text-xs font-bold"
              style={{ color: accent }}
            >
              {memo.confidence}%
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/80">
          {memo.verdict}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default BoardMemo;
