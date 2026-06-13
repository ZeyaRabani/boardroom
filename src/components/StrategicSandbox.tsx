"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Crown,
  FlaskConical,
  GitBranch,
  Loader2,
  Scale,
  Send,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import {
  AGENTS,
  AGENT_ROLES,
  type AgentReaction,
  type BoardAnalysis,
  type ReactionDirection,
} from "@/lib/types";
import type { AgentStatus } from "@/lib/useBoard";
import type { useSandbox } from "@/lib/useSandbox";
import { cn } from "@/lib/utils";

/** Ready-made what-ifs so the demo lands instantly. */
const PRESET_SCENARIOS = [
  "Cut prices by 50%",
  "Raise a $10M round",
  "Launch in Europe first",
  "Remove the AI, use humans instead",
  "Go fully self-serve, no sales team",
  "Pivot to enterprise customers",
];

const DIRECTION: Record<
  ReactionDirection,
  { Icon: typeof ArrowUp; text: string; bg: string; ring: string; label: string }
> = {
  up: {
    Icon: ArrowUp,
    text: "text-emerald-300",
    bg: "bg-emerald-500/15",
    ring: "ring-emerald-500/30",
    label: "conviction up",
  },
  down: {
    Icon: ArrowDown,
    text: "text-rose-300",
    bg: "bg-rose-500/15",
    ring: "ring-rose-500/30",
    label: "conviction down",
  },
  neutral: {
    Icon: ArrowRight,
    text: "text-slate-300",
    bg: "bg-slate-400/15",
    ring: "ring-slate-400/30",
    label: "holds",
  },
};

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/* ── a single board member's live reaction ────────────────────────────────── */

function ReactionCard({
  role,
  reaction,
  status,
}: {
  role: (typeof AGENT_ROLES)[number];
  reaction?: AgentReaction;
  status: AgentStatus;
}) {
  const profile = AGENTS[role];
  const dir = reaction ? DIRECTION[reaction.direction] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] p-4"
    >
      <div
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: profile.accent }}
      />
      <div className="flex items-start gap-3 pl-1.5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base"
          style={{
            background: `linear-gradient(135deg, ${profile.accent}30, ${profile.accent}10)`,
            border: `1.5px solid ${profile.accent}55`,
          }}
          aria-hidden
        >
          {profile.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-white">
              {profile.title}
            </span>
            {dir && (
              <span
                className={cn(
                  "ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1",
                  dir.bg,
                  dir.text,
                  dir.ring,
                )}
                title={dir.label}
              >
                <dir.Icon className="h-3 w-3" />
                {reaction!.direction}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {status === "thinking" || !reaction ? (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2 flex items-center gap-1.5"
                aria-label="Reacting"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: profile.accent }}
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p
                  className="mt-1.5 text-[13px] font-semibold leading-snug"
                  style={{ color: profile.accent }}
                >
                  “{reaction.reaction}”
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-white/55">
                  {reaction.reasoning}
                </p>
                {/* intensity bar — how much this member cares */}
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[9px] font-medium uppercase tracking-wider text-white/30">
                    Intensity
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: profile.accent }}
                      initial={{ width: 0 }}
                      animate={{ width: `${reaction.intensity}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  <span className="w-7 text-right text-[10px] tabular-nums text-white/40">
                    {reaction.intensity}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ── winners / losers / tradeoffs / second-order quadrant ─────────────────── */

function ImpactQuadrant({
  title,
  Icon,
  items,
  accent,
}: {
  title: string;
  Icon: typeof Crown;
  items: string[];
  accent: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1020] p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: accent }} />
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50">
          {title}
        </h4>
      </div>
      <ul className="mt-2.5 space-y-1.5">
        {items.map((it, i) => (
          <li
            key={i}
            className="flex gap-2 text-[13px] leading-relaxed text-white/70"
          >
            <span style={{ color: accent }}>•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── animated net board-score delta ───────────────────────────────────────── */

function ScoreDelta({
  baseline,
  netDelta,
}: {
  baseline: number;
  netDelta: number;
}) {
  const next = clampScore(baseline + netDelta);
  const positive = netDelta > 0;
  const flat = netDelta === 0;
  const color = flat
    ? "#94a3b8"
    : positive
      ? "#34d399"
      : "#f87171";
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1020] px-5 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
        Board score
      </div>
      <div className="ml-auto flex items-center gap-2 text-lg font-bold tabular-nums">
        <span className="text-white/40">{baseline}</span>
        <ArrowRight className="h-4 w-4 text-white/30" />
        <motion.span
          key={next}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          style={{ color }}
        >
          {next}
        </motion.span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-semibold"
          style={{ backgroundColor: `${color}1f`, color }}
        >
          {positive ? "+" : ""}
          {netDelta}
        </span>
      </div>
    </div>
  );
}

/* ── main export ──────────────────────────────────────────────────────────── */

export function StrategicSandbox({
  idea,
  analysis,
  sandbox,
}: {
  idea: string;
  analysis: BoardAnalysis;
  sandbox: ReturnType<typeof useSandbox>;
}) {
  const { state, run } = sandbox;
  const [input, setInput] = useState("");
  const baseline = analysis.scorecard.overall;
  const showReactions =
    state.running || state.reactions.length > 0 || !!state.impact;

  const submit = (scenario: string) => {
    if (!scenario.trim() || state.running) return;
    setInput("");
    void run(scenario, { idea, analysis });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-indigo-400/20 bg-indigo-500/[0.04] p-5"
    >
      <div className="flex items-center gap-2">
        <FlaskConical className="h-4 w-4 text-indigo-300" />
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-indigo-200/80">
          Strategic Sandbox
        </h2>
      </div>
      <p className="mt-1 text-xs text-white/40">
        Propose a change and watch the board react live — each member through
        their own incentives. Changes stack, so you can keep reshaping the
        business.
      </p>

      {/* applied-changes breadcrumb */}
      {state.turns.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-white/40">
          <GitBranch className="h-3.5 w-3.5" />
          {state.turns.map((t, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-white/20">→</span>}
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-white/60">
                {t.scenario}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* preset chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {PRESET_SCENARIOS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => submit(p)}
            disabled={state.running}
            className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition hover:border-indigo-400/50 hover:text-indigo-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {p}
          </button>
        ))}
      </div>

      {/* free-text input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What if we… (e.g. focus on airports instead of offices?)"
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-indigo-400/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state.running || !input.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {state.running ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Run
        </button>
      </form>

      {state.error && (
        <p className="mt-3 text-sm text-rose-400">⚠ {state.error}</p>
      )}

      {/* live reactions */}
      <AnimatePresence>
        {showReactions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-5 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <p className="text-xs font-medium text-white/60">
                The board reacts to{" "}
                <span className="text-white/90">“{state.scenario}”</span>
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {AGENT_ROLES.map((role) => (
                <ReactionCard
                  key={role}
                  role={role}
                  reaction={state.reactions.find((r) => r.role === role)}
                  status={state.reactionStatus[role]}
                />
              ))}
            </div>

            {/* board-level impact */}
            <AnimatePresence>
              {state.impact && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3"
                >
                  <ScoreDelta
                    baseline={baseline}
                    netDelta={state.impact.netDelta}
                  />

                  {state.impact.verdict && (
                    <div className="rounded-2xl border border-indigo-400/25 bg-indigo-500/[0.06] px-5 py-3 text-sm font-medium leading-relaxed text-indigo-100">
                      {state.impact.verdict}
                    </div>
                  )}

                  <div className="grid gap-3 md:grid-cols-2">
                    <ImpactQuadrant
                      title="Winners"
                      Icon={Crown}
                      items={state.impact.winners}
                      accent="#34d399"
                    />
                    <ImpactQuadrant
                      title="Losers"
                      Icon={TrendingDown}
                      items={state.impact.losers}
                      accent="#f87171"
                    />
                    <ImpactQuadrant
                      title="Tradeoffs"
                      Icon={Scale}
                      items={state.impact.tradeoffs}
                      accent="#fbbf24"
                    />
                    <ImpactQuadrant
                      title="Second-order effects"
                      Icon={GitBranch}
                      items={state.impact.secondOrder}
                      accent="#818cf8"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default StrategicSandbox;
