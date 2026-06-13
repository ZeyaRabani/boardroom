"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { AGENTS, type AgentAnalysis, type AgentMessageStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ── stance pill palette ─────────────────────────────────────────────────── */

const STANCE_STYLES: Record<AgentAnalysis["stance"], { bg: string; text: string; ring: string; dot: string }> = {
  bullish: { bg: "bg-emerald-500/15", text: "text-emerald-300", ring: "ring-emerald-500/30", dot: "#10b981" },
  neutral: { bg: "bg-slate-400/15", text: "text-slate-300", ring: "ring-slate-400/30", dot: "#94a3b8" },
  bearish: { bg: "bg-rose-500/15", text: "text-rose-300", ring: "ring-rose-500/30", dot: "#f43f5e" },
};

/* ── typing dots (thinking state) ────────────────────────────────────────── */

function TypingDots({ accent }: { accent: string }) {
  return (
    <span className="mt-3 flex items-center gap-1.5" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: accent }}
          animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.15, 0.85] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

/* ── main export ─────────────────────────────────────────────────────────── */

export interface AgentMessageProps {
  analysis: AgentAnalysis;
  status?: AgentMessageStatus;
}

export function AgentMessage({ analysis, status = "done" }: AgentMessageProps) {
  const profile = AGENTS[analysis.role];
  const stance = STANCE_STYLES[analysis.stance];
  const isSpeaking = status === "speaking";
  const isThinking = status === "thinking";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* accent glow behind card while speaking */}
      {isSpeaking && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl"
          style={{ boxShadow: `0 0 24px 2px ${profile.accent}30` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border p-5 transition-colors duration-300",
          isSpeaking
            ? "border-white/15 bg-[#0b1020]"
            : "border-white/10 bg-[#0b1020]/80",
        )}
      >
        {/* left accent bar */}
        <div
          className="absolute inset-y-0 left-0 w-[3px]"
          style={{ backgroundColor: profile.accent }}
        />

        {/* ── header row ────────────────────────────────────────────── */}
        <div className="flex items-start gap-3.5 pl-2">
          {/* avatar */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${profile.accent}30, ${profile.accent}10)`,
              border: `1.5px solid ${profile.accent}55`,
            }}
            aria-hidden
          >
            {profile.emoji}
          </div>

          <div className="min-w-0 flex-1">
            {/* name + title + stance */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-[15px] font-semibold tracking-tight text-white">
                {profile.name}
              </span>
              <span className="text-xs text-white/40">{profile.title}</span>

              {/* stance pill */}
              <span
                className={cn(
                  "ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1",
                  stance.bg,
                  stance.text,
                  stance.ring,
                )}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: stance.dot }}
                />
                {analysis.stance}
              </span>
            </div>

            {/* tagline */}
            <p className="mt-0.5 text-[11px] text-white/30 italic">{profile.tagline}</p>

            {/* ── headline ───────────────────────────────────────── */}
            <motion.h3
              className="mt-2.5 text-sm font-semibold leading-snug text-white/95"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.35 }}
            >
              <MessageSquare
                className="mr-1.5 -mt-0.5 inline-block h-3.5 w-3.5"
                style={{ color: profile.accent }}
              />
              {analysis.headline}
            </motion.h3>

            {/* ── body / status states ───────────────────────────── */}
            <AnimatePresence mode="wait">
              {isThinking ? (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <TypingDots accent={profile.accent} />
                </motion.div>
              ) : (
                <motion.div
                  key="body"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mt-2.5"
                >
                  <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-white/65">
                    {analysis.analysis}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* speaking live indicator */}
        {isSpeaking && (
          <motion.div
            className="mt-3 flex items-center gap-1.5 pl-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: profile.accent }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">
              Speaking
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default AgentMessage;
