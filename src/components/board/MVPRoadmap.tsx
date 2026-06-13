"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Flag, Rocket, Target, Zap } from "lucide-react";
import type { MVPRoadmapData } from "@/lib/types";
import { cn } from "@/lib/utils";

const PHASE_ICONS = [Flag, Zap, Rocket, Target, CheckCircle2];

export interface MVPRoadmapProps {
  roadmap: MVPRoadmapData;
}

export function MVPRoadmap({ roadmap }: MVPRoadmapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1020] to-[#0d0f1a] p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
          <Rocket className="h-4 w-4 text-violet-400" />
        </div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">
          MVP Roadmap
        </h3>
      </div>

      {/* North Star */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/[0.05] px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-violet-400" />
          <span className="text-xs font-semibold uppercase tracking-wide text-violet-400">
            North Star
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-white/80">
          {roadmap.northStar}
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="mt-6">
        {/* Horizontal on lg, vertical below */}
        <div className="hidden lg:flex lg:items-start lg:gap-0">
          {roadmap.phases.map((phase, i) => {
            const Icon = PHASE_ICONS[i % PHASE_ICONS.length];
            const isLast = i === roadmap.phases.length - 1;
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                className="relative flex-1"
              >
                {/* Connector line */}
                {!isLast && (
                  <div className="absolute left-[calc(50%+16px)] top-[14px] right-0 h-px bg-gradient-to-r from-violet-500/40 to-white/10" />
                )}
                {/* Node */}
                <div className="flex flex-col items-center">
                  <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10">
                    <Icon className="h-3.5 w-3.5 text-violet-400" />
                  </div>
                  <span className="mt-2 inline-block rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-semibold text-white/50">
                    {phase.timeframe}
                  </span>
                </div>
                {/* Content */}
                <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <h4 className="text-sm font-semibold text-white">{phase.name}</h4>
                  <p className="mt-0.5 text-xs text-white/50">{phase.goal}</p>
                  <ul className="mt-2 space-y-1">
                    {phase.tasks.map((t, ti) => (
                      <li key={ti} className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500/50" />
                        <span className="text-xs text-white/60">{t.title}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 rounded-md bg-emerald-500/[0.06] px-2 py-1">
                    <p className="text-xs font-medium text-emerald-400">
                      → {phase.outcome}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Vertical timeline for mobile/tablet */}
        <div className="lg:hidden">
          <div className="relative border-l-2 border-white/10 pl-6">
            {roadmap.phases.map((phase, i) => {
              const Icon = PHASE_ICONS[i % PHASE_ICONS.length];
              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                  className={cn("relative", i > 0 && "mt-6")}
                >
                  {/* Node on the line */}
                  <div className="absolute -left-[calc(1.5rem+5px)] top-0 flex h-7 w-7 items-center justify-center rounded-full border border-violet-500/30 bg-[#0b1020]">
                    <Icon className="h-3.5 w-3.5 text-violet-400" />
                  </div>

                  {/* Phase content */}
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-white">
                        {phase.name}
                      </h4>
                      <span className="shrink-0 rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-semibold text-white/50">
                        {phase.timeframe}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-white/50">{phase.goal}</p>
                    <ul className="mt-3 space-y-1.5">
                      {phase.tasks.map((t, ti) => (
                        <li key={ti} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500/50" />
                          <div>
                            <span className="text-xs text-white/70">{t.title}</span>
                            {t.description && (
                              <p className="mt-0.5 text-[11px] text-white/40">
                                {t.description}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 rounded-md bg-emerald-500/[0.06] px-2.5 py-1.5">
                      <p className="text-xs font-medium text-emerald-400">
                        → {phase.outcome}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MVPRoadmap;
