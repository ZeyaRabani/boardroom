/**
 * Boardroom — shared type contracts.
 *
 * This file is the single source of truth for the data shapes that flow between
 * the board agents (lib/agents), the LLM providers (lib/llm) and the generative
 * UI components (components/board). Do not change a published shape without
 * updating every consumer.
 */

import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* Board members                                                              */
/* -------------------------------------------------------------------------- */

export type AgentRole = "vc" | "cfo" | "cto" | "customer" | "competitor";

export const AGENT_ROLES: AgentRole[] = [
  "vc",
  "cfo",
  "cto",
  "customer",
  "competitor",
];

export interface AgentProfile {
  role: AgentRole;
  /** Persona display name, e.g. "Vega Capital". */
  name: string;
  /** Seat at the table, e.g. "Venture Capitalist". */
  title: string;
  /** Single emoji used as the avatar fallback. */
  emoji: string;
  /** Tailwind-friendly hex accent colour for this member. */
  accent: string;
  /** One-line description of what this member cares about. */
  tagline: string;
}

export const AGENTS: Record<AgentRole, AgentProfile> = {
  vc: {
    role: "vc",
    name: "Vega Capital",
    title: "Venture Capitalist",
    emoji: "💸",
    accent: "#7c3aed",
    tagline: "Market size, moat, and venture-scale returns.",
  },
  cfo: {
    role: "cfo",
    name: "Numa Sterling",
    title: "Chief Financial Officer",
    emoji: "📊",
    accent: "#0ea5e9",
    tagline: "Unit economics, burn, and the path to break-even.",
  },
  cto: {
    role: "cto",
    name: "AdaKernel",
    title: "Chief Technology Officer",
    emoji: "🛠️",
    accent: "#10b981",
    tagline: "Feasibility, architecture, and time-to-build.",
  },
  customer: {
    role: "customer",
    name: "Remi Buyer",
    title: "Voice of the Customer",
    emoji: "🙋",
    accent: "#f59e0b",
    tagline: "Real pain, willingness to pay, and adoption.",
  },
  competitor: {
    role: "competitor",
    name: "Rival Watch",
    title: "Competitive Analyst",
    emoji: "♟️",
    accent: "#ef4444",
    tagline: "Incumbents, substitutes, and how you get crushed.",
  },
};

/* -------------------------------------------------------------------------- */
/* Shared scalars                                                             */
/* -------------------------------------------------------------------------- */

export type Severity = "low" | "medium" | "high" | "critical";
export type Likelihood = "low" | "medium" | "high";
export type Impact = "low" | "medium" | "high";
export type Stance = "bullish" | "neutral" | "bearish";
export type Effort = "S" | "M" | "L";
export type Priority = "P0" | "P1" | "P2";

/* -------------------------------------------------------------------------- */
/* Atoms rendered by the generative UI components                             */
/* -------------------------------------------------------------------------- */

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  likelihood: Likelihood;
  /** Free-form category, e.g. "Market", "Regulatory", "Execution". */
  category: string;
  mitigation: string;
  raisedBy: AgentRole;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  impact: Impact;
  /** Rough horizon, e.g. "0-3 months", "12+ months". */
  timeframe: string;
  /** 0-100 confidence the opportunity is real and capturable. */
  confidence: number;
  raisedBy: AgentRole;
}

export interface ScoreDimension {
  /** e.g. "Market", "Moat", "Feasibility", "Demand", "Economics". */
  label: string;
  /** 0-10. */
  score: number;
  rationale: string;
}

export type Verdict = "strong" | "promising" | "risky" | "weak";

export interface ScoreCardData {
  /** 0-100 weighted overall investability score. */
  overall: number;
  verdict: Verdict;
  dimensions: ScoreDimension[];
  summary: string;
}

export interface Competitor {
  id: string;
  name: string;
  description: string;
  /** 0-100 position on the x axis (see CompetitorMapData.xAxisLabel). */
  xAxis: number;
  /** 0-100 position on the y axis (see CompetitorMapData.yAxisLabel). */
  yAxis: number;
  strength: string;
  weakness: string;
  threatLevel: Severity;
}

export interface CompetitorMapData {
  /** Axis semantics, e.g. "Price (low → high)". */
  xAxisLabel: string;
  yAxisLabel: string;
  competitors: Competitor[];
  /** Where the user's startup sits on the same axes. */
  you: { name: string; xAxis: number; yAxis: number };
  insight: string;
}

export interface RoadmapTask {
  title: string;
  description?: string;
}

export interface RoadmapPhase {
  id: string;
  name: string;
  /** e.g. "Weekend", "Weeks 1-2", "Month 2". */
  timeframe: string;
  goal: string;
  tasks: RoadmapTask[];
  outcome: string;
}

export interface MVPRoadmapData {
  northStar: string;
  phases: RoadmapPhase[];
}

export type Recommendation = "invest" | "explore" | "pivot" | "pass";

export interface BoardMemoData {
  title: string;
  date?: string;
  recommendation: Recommendation;
  thesis: string;
  keyRisks: string[];
  keyOpportunities: string[];
  /** Conditions / things that must be true for this to work. */
  conditions: string[];
  verdict: string;
  /** 0-100 board confidence. */
  confidence: number;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  owner?: string;
  effort: Effort;
  priority: Priority;
  /** Optional scheduling hint, e.g. "Sat AM", "Day 1". */
  day?: string;
  done?: boolean;
}

export interface ActionPlanData {
  title: string;
  goal: string;
  /** e.g. "This weekend". */
  timeframe: string;
  items: ActionItem[];
  successMetric: string;
}

/* -------------------------------------------------------------------------- */
/* Agent + board level results                                                */
/* -------------------------------------------------------------------------- */

export type AgentMessageStatus = "thinking" | "speaking" | "done";

/**
 * What a single board member returns after analysing the idea. The orchestrator
 * aggregates these into the board-level structures below.
 */
export interface AgentAnalysis {
  role: AgentRole;
  /** One-line takeaway shown as the message headline. */
  headline: string;
  /** The member's spoken analysis (markdown allowed). */
  analysis: string;
  stance: Stance;
  risks: Risk[];
  opportunities: Opportunity[];
  /** This member's scored dimensions (0-10 each). */
  scores: ScoreDimension[];
  /** Competitor agent only. */
  competitors?: Competitor[];
  /** CTO agent only — suggested build phases. */
  roadmapPhases?: RoadmapPhase[];
}

/** The full board analysis produced by the orchestrator. */
export interface BoardAnalysis {
  idea: string;
  agents: AgentAnalysis[];
  scorecard: ScoreCardData;
  risks: Risk[];
  opportunities: Opportunity[];
  competitorMap: CompetitorMapData;
  roadmap: MVPRoadmapData;
}

/** Final board output produced when the user asks for a recommendation. */
export interface BoardSynthesis {
  memo: BoardMemoData;
  actionPlan: ActionPlanData;
}

/* -------------------------------------------------------------------------- */
/* Strategic Sandbox — live "what-if" simulation                              */
/* -------------------------------------------------------------------------- */

/** Which way a board member's conviction moved in response to a change. */
export type ReactionDirection = "up" | "down" | "neutral";

/**
 * How a single board member reacts to a founder's proposed change, viewed
 * strictly through that member's own incentives and worldview.
 */
export interface AgentReaction {
  role: AgentRole;
  /** Stance after the change is applied. */
  stance: Stance;
  /** Did this member's conviction move up, down, or hold? */
  direction: ReactionDirection;
  /** Punchy one-liner in the member's voice, e.g. "adoption increases". */
  reaction: string;
  /** 1-2 sentences of reasoning grounded in this member's incentives. */
  reasoning: string;
  /** 0-100 — how strongly this member cares about this particular change. */
  intensity: number;
}

/**
 * Board-level read-out of a single proposed change: who wins, who loses, the
 * tensions it creates, and the non-obvious downstream effects.
 */
export interface SandboxResult {
  /** The change the founder proposed, e.g. "Cut prices by 50%". */
  scenario: string;
  reactions: AgentReaction[];
  /** Who/what benefits from the change. */
  winners: string[];
  /** Who/what is hurt by the change. */
  losers: string[];
  /** Explicit tensions the change creates ("X improves but Y suffers"). */
  tradeoffs: string[];
  /** Non-obvious downstream / second-order consequences. */
  secondOrder: string[];
  /** Change to the board's overall 0-100 conviction score (-100..100). */
  netDelta: number;
  /** One-line board headline summarising the net effect. */
  verdict: string;
}

/* -------------------------------------------------------------------------- */
/* Streaming protocol (server -> client)                                      */
/* -------------------------------------------------------------------------- */

/**
 * Events streamed from /api/board/analyze. The client renders generative UI as
 * each event arrives, so the boardroom feels live.
 */
export type BoardStreamEvent =
  | { type: "status"; message: string }
  | { type: "agent_start"; role: AgentRole }
  | { type: "agent_done"; analysis: AgentAnalysis }
  | { type: "scorecard"; scorecard: ScoreCardData }
  | { type: "competitor_map"; competitorMap: CompetitorMapData }
  | { type: "roadmap"; roadmap: MVPRoadmapData }
  | { type: "complete"; analysis: BoardAnalysis }
  | { type: "error"; message: string };

/**
 * Events streamed from /api/board/sandbox while the board reacts to a founder's
 * proposed change. Reactions arrive one member at a time, then the board-level
 * impact lands, so the simulation feels live.
 */
export type SandboxStreamEvent =
  | { type: "status"; message: string }
  | { type: "reaction_start"; role: AgentRole }
  | { type: "reaction_done"; reaction: AgentReaction }
  | {
      type: "impact";
      impact: {
        winners: string[];
        losers: string[];
        tradeoffs: string[];
        secondOrder: string[];
        netDelta: number;
        verdict: string;
      };
    }
  | { type: "complete"; result: SandboxResult }
  | { type: "error"; message: string };

/* -------------------------------------------------------------------------- */
/* Zod schemas — validate LLM JSON output                                     */
/* -------------------------------------------------------------------------- */

export const severitySchema = z.enum(["low", "medium", "high", "critical"]);
export const likelihoodSchema = z.enum(["low", "medium", "high"]);
export const impactSchema = z.enum(["low", "medium", "high"]);
export const stanceSchema = z.enum(["bullish", "neutral", "bearish"]);

export const riskSchema = z.object({
  title: z.string(),
  description: z.string(),
  severity: severitySchema,
  likelihood: likelihoodSchema,
  category: z.string(),
  mitigation: z.string(),
});

export const opportunitySchema = z.object({
  title: z.string(),
  description: z.string(),
  impact: impactSchema,
  timeframe: z.string(),
  confidence: z.number().min(0).max(100),
});

export const scoreDimensionSchema = z.object({
  label: z.string(),
  score: z.number().min(0).max(10),
  rationale: z.string(),
});

export const competitorSchema = z.object({
  name: z.string(),
  description: z.string(),
  xAxis: z.number().min(0).max(100),
  yAxis: z.number().min(0).max(100),
  strength: z.string(),
  weakness: z.string(),
  threatLevel: severitySchema,
});

export const roadmapPhaseSchema = z.object({
  name: z.string(),
  timeframe: z.string(),
  goal: z.string(),
  tasks: z.array(
    z.object({ title: z.string(), description: z.string().optional() }),
  ),
  outcome: z.string(),
});

/**
 * Raw shape we ask each board member to emit. IDs and `raisedBy`/`role` are
 * stamped on by the orchestrator, so the model never has to invent them.
 */
export const agentAnalysisSchema = z.object({
  headline: z.string(),
  analysis: z.string(),
  stance: stanceSchema,
  risks: z.array(riskSchema),
  opportunities: z.array(opportunitySchema),
  scores: z.array(scoreDimensionSchema),
  competitors: z.array(competitorSchema).optional(),
  roadmapPhases: z.array(roadmapPhaseSchema).optional(),
});
export type AgentAnalysisRaw = z.infer<typeof agentAnalysisSchema>;

export const boardMemoSchema = z.object({
  title: z.string(),
  recommendation: z.enum(["invest", "explore", "pivot", "pass"]),
  thesis: z.string(),
  keyRisks: z.array(z.string()),
  keyOpportunities: z.array(z.string()),
  conditions: z.array(z.string()),
  verdict: z.string(),
  confidence: z.number().min(0).max(100),
});

export const actionItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  owner: z.string().optional(),
  effort: z.enum(["S", "M", "L"]),
  priority: z.enum(["P0", "P1", "P2"]),
  day: z.string().optional(),
});

export const actionPlanSchema = z.object({
  title: z.string(),
  goal: z.string(),
  timeframe: z.string(),
  items: z.array(actionItemSchema),
  successMetric: z.string(),
});

export const boardSynthesisSchema = z.object({
  memo: boardMemoSchema,
  actionPlan: actionPlanSchema,
});
export type BoardSynthesisRaw = z.infer<typeof boardSynthesisSchema>;

/* -------------------------------------------------------------------------- */
/* Strategic Sandbox schemas                                                  */
/* -------------------------------------------------------------------------- */

export const reactionDirectionSchema = z.enum(["up", "down", "neutral"]);

/**
 * Raw shape each board member emits when reacting to a proposed change. The
 * orchestrator stamps on `role`, so the model never invents it.
 */
export const agentReactionSchema = z.object({
  stance: stanceSchema,
  direction: reactionDirectionSchema,
  reaction: z.string(),
  reasoning: z.string(),
  intensity: z.number().min(0).max(100),
});
export type AgentReactionRaw = z.infer<typeof agentReactionSchema>;

/** Board-level impact synthesis for a single proposed change. */
export const sandboxImpactSchema = z.object({
  winners: z.array(z.string()),
  losers: z.array(z.string()),
  tradeoffs: z.array(z.string()),
  secondOrder: z.array(z.string()),
  netDelta: z.number().min(-100).max(100),
  verdict: z.string(),
});
export type SandboxImpactRaw = z.infer<typeof sandboxImpactSchema>;
