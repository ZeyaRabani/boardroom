"use client";

import { Target } from "lucide-react";
import type { ActionItem, ActionPlanData, Effort, Priority } from "@/lib/types";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES: Record<Priority, string> = {
  P0: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
  P1: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  P2: "bg-white/10 text-white/60 ring-white/20",
};

const EFFORT_LABEL: Record<Effort, string> = { S: "S", M: "M", L: "L" };

function Item({ item }: { item: ActionItem }) {
  return (
    <li className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <span
        className={cn(
          "mt-0.5 h-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
          PRIORITY_STYLES[item.priority],
        )}
      >
        {item.priority}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-white">{item.title}</h4>
          {item.day && <span className="text-[11px] text-white/40">{item.day}</span>}
          <span className="ml-auto rounded bg-white/5 px-1.5 text-[10px] text-white/50">
            {EFFORT_LABEL[item.effort]}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-white/70">{item.description}</p>
        {item.owner && <p className="mt-1 text-[11px] text-white/40">owner: {item.owner}</p>}
      </div>
    </li>
  );
}

export interface ActionPlanProps {
  plan: ActionPlanData;
}

/** Placeholder — polish in sub-agent. */
export function ActionPlan({ plan }: ActionPlanProps) {
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.08] to-white/[0.02] p-6">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-emerald-300" />
        <h3 className="flex-1 text-lg font-semibold text-white">{plan.title}</h3>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
          {plan.timeframe}
        </span>
      </div>
      <p className="mt-2 text-sm text-white/80">
        <span className="font-medium">Goal: </span>
        {plan.goal}
      </p>
      <ul className="mt-4 space-y-2">
        {plan.items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </ul>
      <div className="mt-4 rounded-xl border border-emerald-500/20 bg-black/20 p-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-emerald-300/80">
          Success metric
        </span>
        <p className="mt-0.5 text-sm text-white/85">{plan.successMetric}</p>
      </div>
    </div>
  );
}

export default ActionPlan;
