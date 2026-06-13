"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Rocket,
  Target,
  Zap,
} from "lucide-react";
import type { ActionItem, ActionPlanData, Effort, Priority } from "@/lib/types";
import { cn } from "@/lib/utils";

const PRIORITY_CONFIG: Record<
  Priority,
  { bg: string; text: string; ring: string; color: string }
> = {
  P0: {
    bg: "bg-rose-500/15",
    text: "text-rose-300",
    ring: "ring-rose-500/30",
    color: "#ef4444",
  },
  P1: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    ring: "ring-amber-500/30",
    color: "#f59e0b",
  },
  P2: {
    bg: "bg-white/8",
    text: "text-white/60",
    ring: "ring-white/15",
    color: "#64748b",
  },
};

const EFFORT_CONFIG: Record<Effort, { label: string; color: string }> = {
  S: { label: "S", color: "#10b981" },
  M: { label: "M", color: "#0ea5e9" },
  L: { label: "L", color: "#f59e0b" },
};

function ActionItemCard({
  item,
  index,
}: {
  item: ActionItem;
  index: number;
}) {
  const priority = PRIORITY_CONFIG[item.priority];
  const effort = EFFORT_CONFIG[item.effort];

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.08, ease: "easeOut" }}
      className={cn(
        "group relative flex gap-3 rounded-xl border bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]",
        item.done ? "border-emerald-500/20" : "border-white/8",
      )}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0 pt-0.5">
        {item.done ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        ) : (
          <Circle className="h-5 w-5 text-white/20" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4
            className={cn(
              "font-semibold",
              item.done
                ? "text-white/50 line-through"
                : "text-white",
            )}
          >
            {item.title}
          </h4>

          {/* Priority badge */}
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1",
              priority.bg,
              priority.text,
              priority.ring,
            )}
          >
            {item.priority}
          </span>

          {/* Effort chip */}
          <span
            className="inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold"
            style={{
              backgroundColor: `${effort.color}15`,
              color: effort.color,
            }}
          >
            {effort.label}
          </span>

          {/* Day badge */}
          {item.day && (
            <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
              <Calendar className="h-2.5 w-2.5" />
              {item.day}
            </span>
          )}
        </div>

        <p
          className={cn(
            "mt-1.5 text-sm leading-relaxed",
            item.done ? "text-white/40" : "text-white/65",
          )}
        >
          {item.description}
        </p>

        {item.owner && (
          <p className="mt-1.5 text-[11px] text-white/35">
            <span className="text-white/50">Owner:</span> {item.owner}
          </p>
        )}
      </div>

      {/* Side priority accent */}
      <div
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full opacity-60"
        style={{ backgroundColor: priority.color }}
      />
    </motion.li>
  );
}

export interface ActionPlanProps {
  plan: ActionPlanData;
}

export function ActionPlan({ plan }: ActionPlanProps) {
  const completedCount = plan.items.filter((i) => i.done).length;
  const totalCount = plan.items.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]"
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{
          background: "linear-gradient(90deg, #10b981, transparent)",
        }}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Rocket className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">
                {plan.title}
              </h3>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-xs text-white/40">{plan.timeframe}</span>
                {totalCount > 0 && (
                  <>
                    <span className="text-white/20">·</span>
                    <span className="text-xs text-emerald-400/80">
                      {completedCount}/{totalCount} done
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-white/60">Sprint</span>
          </div>
        </div>

        {/* Goal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3"
        >
          <div className="flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-white/40" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Goal
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-white/80">
            {plan.goal}
          </p>
        </motion.div>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(completedCount / totalCount) * 100}%`,
                }}
                transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 rounded-full bg-emerald-500/80"
              />
            </div>
            <span className="text-[10px] font-medium text-white/30">
              {Math.round((completedCount / totalCount) * 100)}%
            </span>
          </div>
        )}

        {/* Items */}
        <ul className="mt-5 space-y-2.5">
          {plan.items.map((item, i) => (
            <ActionItemCard key={item.id} item={item} index={i} />
          ))}
        </ul>

        {/* Success metric */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400/80">
              Success Metric
            </span>
          </div>
          <p className="mt-2 text-sm font-medium leading-relaxed text-white/85">
            {plan.successMetric}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ActionPlan;
