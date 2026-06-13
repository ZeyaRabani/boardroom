"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { FileUp, Loader2, Sparkles } from "lucide-react";
import {
  ActionPlan,
  AgentMessage,
  BoardMemo,
  CompetitorMap,
  MVPRoadmap,
  OpportunityCard,
  RiskCard,
  ScoreCard,
} from "@/components/board";
import { BoardCopilot } from "@/components/BoardCopilot";
import { AGENTS, AGENT_ROLES } from "@/lib/types";
import { SAMPLE_IDEA } from "@/lib/sample";
import { useBoard } from "@/lib/useBoard";
import { cn } from "@/lib/utils";

const WEEKEND_QUESTION = "What should I build this weekend to prove this?";

function ProviderBadge() {
  const [info, setInfo] = useState<{ name: string; live: boolean } | null>(null);
  useEffect(() => {
    fetch("/api/provider")
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => setInfo(null));
  }, []);
  if (!info) return null;
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium ring-1",
        info.live
          ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
          : "bg-amber-500/10 text-amber-300 ring-amber-500/30",
      )}
      title={info.live ? `Live model: ${info.name}` : "No credentials — demo mode"}
    >
      {info.live ? `Live · ${info.name}` : "Demo mode · mock"}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/40">
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

export function Boardroom() {
  const board = useBoard();
  const { state, setIdea, analyze, synthesize } = board;
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (data.text) {
          setIdea(
            `From uploaded deck "${data.filename}":\n\n${data.text.slice(0, 4000)}`,
          );
        }
      } finally {
        setUploading(false);
      }
    },
    [setIdea],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const started = state.running || state.messages.length > 0 || !!state.analysis;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-indigo-400">Board</span>room
          </h1>
          <p className="text-sm text-white/50">
            Convene a live AI board to pressure-test your startup idea.
          </p>
        </div>
        <ProviderBadge />
      </header>

      {/* Idea input */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      >
        <textarea
          value={state.idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Paste your startup idea… e.g. an AI tool that turns support tickets into a ranked product roadmap."
          rows={4}
          className="w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white placeholder:text-white/30 focus:border-indigo-400/50 focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={() => analyze(state.idea)}
            disabled={state.running || !state.idea.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {state.running ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {state.running ? "Board in session…" : "Convene the board"}
          </button>

          <div
            {...getRootProps()}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-2 text-sm text-white/60 transition hover:border-white/40",
              isDragActive && "border-indigo-400 text-indigo-300",
            )}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileUp className="h-4 w-4" />
            )}
            {uploading ? "Reading deck…" : "Upload deck (PDF)"}
          </div>

          <button
            onClick={() => setIdea(SAMPLE_IDEA)}
            className="text-xs text-white/40 underline-offset-2 hover:text-white/70 hover:underline"
          >
            use example
          </button>
        </div>
        {state.error && (
          <p className="mt-3 text-sm text-rose-400">⚠ {state.error}</p>
        )}
      </motion.div>

      {/* Roster */}
      {started && (
        <div className="mt-8 flex flex-wrap gap-3">
          {AGENT_ROLES.map((role) => {
            const status = state.agentStatus[role];
            const profile = AGENTS[role];
            return (
              <div
                key={role}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
                  status === "done"
                    ? "border-white/20 bg-white/5 text-white"
                    : status === "thinking"
                      ? "border-indigo-400/40 bg-indigo-400/10 text-indigo-200"
                      : "border-white/10 bg-transparent text-white/40",
                )}
              >
                <span aria-hidden>{profile.emoji}</span>
                <span className="font-medium">{profile.title}</span>
                {status === "thinking" && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10 space-y-10">
        {/* Transcript */}
        {state.messages.length > 0 && (
          <Section title="The debate">
            <div className="space-y-3">
              {AGENT_ROLES.map((role) => {
                const msg = state.messages.find((m) => m.role === role);
                return msg ? <AgentMessage key={role} analysis={msg} /> : null;
              })}
            </div>
          </Section>
        )}

        {/* Score + competitor map */}
        {(state.scorecard || state.competitorMap) && (
          <div className="grid gap-4 lg:grid-cols-2">
            {state.scorecard && <ScoreCard scorecard={state.scorecard} />}
            {state.competitorMap && <CompetitorMap data={state.competitorMap} />}
          </div>
        )}

        {/* Risks */}
        {state.analysis && state.analysis.risks.length > 0 && (
          <Section title="Risks">
            <div className="grid gap-3 md:grid-cols-2">
              {state.analysis.risks.map((risk) => (
                <RiskCard key={risk.id} risk={risk} />
              ))}
            </div>
          </Section>
        )}

        {/* Opportunities */}
        {state.analysis && state.analysis.opportunities.length > 0 && (
          <Section title="Opportunities">
            <div className="grid gap-3 md:grid-cols-2">
              {state.analysis.opportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </Section>
        )}

        {/* Roadmap */}
        {state.roadmap && (
          <Section title="MVP roadmap">
            <MVPRoadmap roadmap={state.roadmap} />
          </Section>
        )}

        {/* Weekend synthesis */}
        {state.analysis && (
          <Section title="The ask">
            {!state.synthesis && (
              <button
                onClick={() => synthesize(WEEKEND_QUESTION)}
                disabled={state.synthesizing}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-50"
              >
                {state.synthesizing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {WEEKEND_QUESTION}
              </button>
            )}
            {state.synthesis && (
              <div className="space-y-4">
                <BoardMemo memo={state.synthesis.memo} />
                <ActionPlan plan={state.synthesis.actionPlan} />
              </div>
            )}
          </Section>
        )}
      </div>

      <CopilotSidebar
        labels={{
          title: "Boardroom",
          initial:
            "Hi — I'm your board chair. Share a startup idea and I'll convene the board, or ask me what to build this weekend to prove it.",
        }}
        defaultOpen={false}
        clickOutsideToClose
      />
      <BoardCopilot board={board} />
    </div>
  );
}

export default Boardroom;
