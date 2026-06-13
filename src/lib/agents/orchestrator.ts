/**
 * Board orchestrator — runs the five members, aggregates their output into the
 * board-level structures the UI renders, and produces the final memo + action
 * plan. Public API (keep stable):
 *   - runBoardAnalysis(idea, { onEvent })  -> BoardAnalysis
 *   - runBoardSynthesis({ idea, analysis, question }) -> BoardSynthesis
 */

import { getProvider } from "../llm";
import {
  AGENT_ROLES,
  AGENTS,
  agentAnalysisSchema,
  agentReactionSchema,
  boardSynthesisSchema,
  sandboxImpactSchema,
  type AgentAnalysis,
  type AgentAnalysisRaw,
  type AgentReaction,
  type AgentReactionRaw,
  type AgentRole,
  type BoardAnalysis,
  type BoardStreamEvent,
  type BoardSynthesis,
  type CompetitorMapData,
  type MVPRoadmapData,
  type RoadmapPhase,
  type SandboxResult,
  type SandboxStreamEvent,
  type ScoreCardData,
  type ScoreDimension,
  type Verdict,
} from "../types";
import {
  AGENT_SCHEMA_HINT,
  COMPETITOR_X_AXIS,
  COMPETITOR_Y_AXIS,
  PERSONAS,
  REACTION_SCHEMA_HINT,
  SANDBOX_IMPACT_SCHEMA_HINT,
  SANDBOX_IMPACT_SYSTEM,
  SANDBOX_PERSONAS,
  SYNTHESIS_SCHEMA_HINT,
} from "./personas";

export interface RunOptions {
  onEvent?: (event: BoardStreamEvent) => void;
}

const DIMENSION_LABEL: Record<AgentRole, string> = {
  vc: "Market",
  cfo: "Economics",
  cto: "Feasibility",
  customer: "Demand",
  competitor: "Defensibility",
};

function analysisPrompt(idea: string): string {
  return `Evaluate this startup idea as a member of its board:\n\n"""${idea}"""\n\nReturn ONLY the JSON object.`;
}

function stamp(role: AgentRole, raw: AgentAnalysisRaw): AgentAnalysis {
  return {
    role,
    headline: raw.headline,
    analysis: raw.analysis,
    stance: raw.stance,
    risks: raw.risks.map((r, i) => ({ ...r, id: `${role}-r${i + 1}`, raisedBy: role })),
    opportunities: raw.opportunities.map((o, i) => ({
      ...o,
      id: `${role}-o${i + 1}`,
      raisedBy: role,
    })),
    scores: raw.scores,
    competitors: raw.competitors?.map((c, i) => ({ ...c, id: `${role}-c${i + 1}` })),
    roadmapPhases: raw.roadmapPhases?.map((p, i) => ({
      ...p,
      id: `${role}-p${i + 1}`,
    })),
  };
}

function fallbackAnalysis(role: AgentRole): AgentAnalysis {
  return {
    role,
    headline: `${AGENTS[role].title} could not be reached.`,
    analysis:
      "The model did not return a valid response for this seat. Try again, or " +
      "check the provider credentials.",
    stance: "neutral",
    risks: [],
    opportunities: [],
    scores: [{ label: DIMENSION_LABEL[role], score: 5, rationale: "No data." }],
  };
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function buildScoreCard(analyses: AgentAnalysis[]): ScoreCardData {
  const dimensions: ScoreDimension[] = AGENT_ROLES.map((role) => {
    const a = analyses.find((x) => x.role === role);
    const score = a ? avg(a.scores.map((s) => s.score)) : 5;
    return {
      label: DIMENSION_LABEL[role],
      score: Math.round(score * 10) / 10,
      rationale: a?.headline ?? "",
    };
  });
  const overall = Math.round(avg(dimensions.map((d) => d.score)) * 10);
  const verdict: Verdict =
    overall >= 75 ? "strong" : overall >= 60 ? "promising" : overall >= 45 ? "risky" : "weak";
  const summary =
    verdict === "strong"
      ? "The board is convicted: strong demand, a real wedge, and a fast path to proof."
      : verdict === "promising"
        ? "A promising wedge — the board would back it if the key conditions are met."
        : verdict === "risky"
          ? "Interesting but risky; the board needs the core assumptions de-risked first."
          : "The board is unconvinced as framed — a sharper wedge or pivot is needed.";
  return { overall, verdict, dimensions, summary };
}

function buildCompetitorMap(analyses: AgentAnalysis[]): CompetitorMapData {
  const comp = analyses.find((a) => a.role === "competitor");
  const competitors = comp?.competitors ?? [];
  return {
    xAxisLabel: COMPETITOR_X_AXIS,
    yAxisLabel: COMPETITOR_Y_AXIS,
    competitors,
    you: { name: "Your startup", xAxis: 72, yAxis: 88 },
    insight:
      comp?.headline ??
      "Find the quadrant incumbents ignore and defend it with focus and speed.",
  };
}

function buildRoadmap(analyses: AgentAnalysis[]): MVPRoadmapData {
  const cto = analyses.find((a) => a.role === "cto");
  const phases: RoadmapPhase[] =
    cto?.roadmapPhases && cto.roadmapPhases.length > 0
      ? cto.roadmapPhases
      : [
          {
            id: "p1",
            name: "Weekend prototype",
            timeframe: "Weekend",
            goal: "Prove the single riskiest assumption.",
            tasks: [{ title: "Build the thinnest end-to-end slice" }],
            outcome: "A clickable demo of the core value.",
          },
        ];
  return {
    northStar:
      cto?.headline ?? "A user gets the core value from the thinnest possible build.",
    phases,
  };
}

export async function runBoardAnalysis(
  idea: string,
  options: RunOptions = {},
): Promise<BoardAnalysis> {
  const provider = getProvider();
  const emit = (e: BoardStreamEvent) => options.onEvent?.(e);

  emit({ type: "status", message: `Assembling the board (${provider.name})…` });

  const analyses = await Promise.all(
    AGENT_ROLES.map(async (role) => {
      emit({ type: "agent_start", role });
      try {
        const raw = await provider.generateJSON({
          system: PERSONAS[role],
          prompt: analysisPrompt(idea),
          schema: agentAnalysisSchema,
          schemaHint: AGENT_SCHEMA_HINT,
          temperature: 0.7,
          tag: role,
        });
        const analysis = stamp(role, raw);
        emit({ type: "agent_done", analysis });
        return analysis;
      } catch (err) {
        console.error(`[board] agent ${role} failed:`, err);
        const analysis = fallbackAnalysis(role);
        emit({ type: "agent_done", analysis });
        return analysis;
      }
    }),
  );

  const scorecard = buildScoreCard(analyses);
  emit({ type: "scorecard", scorecard });
  const competitorMap = buildCompetitorMap(analyses);
  emit({ type: "competitor_map", competitorMap });
  const roadmap = buildRoadmap(analyses);
  emit({ type: "roadmap", roadmap });

  const analysis: BoardAnalysis = {
    idea,
    agents: analyses,
    scorecard,
    risks: analyses.flatMap((a) => a.risks),
    opportunities: analyses.flatMap((a) => a.opportunities),
    competitorMap,
    roadmap,
  };
  emit({ type: "complete", analysis });
  return analysis;
}

function synthesisPrompt(input: {
  idea: string;
  analysis: BoardAnalysis;
  question: string;
}): string {
  const { idea, analysis, question } = input;
  const board = analysis.agents
    .map(
      (a) =>
        `- ${AGENTS[a.role].title} (${a.stance}): ${a.headline}`,
    )
    .join("\n");
  const risks = analysis.risks
    .slice(0, 6)
    .map((r) => `- [${r.severity}] ${r.title}`)
    .join("\n");
  return `The board evaluated this idea:\n"""${idea}"""\n\nBoard positions:\n${board}\n\nOverall score: ${analysis.scorecard.overall}/100 (${analysis.scorecard.verdict}).\nTop risks:\n${risks}\n\nThe founder asks: "${question}"\n\nSynthesise the board's final recommendation into a memo and a concrete action plan that directly answers the founder's question. Return ONLY the JSON object.`;
}

export async function runBoardSynthesis(input: {
  idea: string;
  analysis: BoardAnalysis;
  question: string;
}): Promise<BoardSynthesis> {
  const provider = getProvider();
  const raw = await provider.generateJSON({
    system:
      "You are the chair of the board summarising the meeting. Be decisive and " +
      "concrete. The action plan must be small enough to execute in the stated " +
      "timeframe and must prove the riskiest assumption.",
    prompt: synthesisPrompt(input),
    schema: boardSynthesisSchema,
    schemaHint: SYNTHESIS_SCHEMA_HINT,
    temperature: 0.6,
    tag: "synthesis",
  });
  return {
    memo: raw.memo,
    actionPlan: {
      ...raw.actionPlan,
      items: raw.actionPlan.items.map((it, i) => ({ ...it, id: `act-${i + 1}` })),
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Strategic Sandbox — live "what-if" simulation                              */
/* -------------------------------------------------------------------------- */

export interface SandboxRunOptions {
  onEvent?: (event: SandboxStreamEvent) => void;
}

/** Compact baseline of the board so reactions stay grounded in the analysis. */
function baselineContext(analysis: BoardAnalysis): string {
  const positions = analysis.agents
    .map((a) => `- ${AGENTS[a.role].title} (${a.stance}): ${a.headline}`)
    .join("\n");
  return `Baseline board score: ${analysis.scorecard.overall}/100 (${analysis.scorecard.verdict}).\nBoard positions before any changes:\n${positions}`;
}

function reactionPrompt(input: {
  role: AgentRole;
  idea: string;
  analysis: BoardAnalysis;
  scenario: string;
  history: string[];
}): string {
  const { role, idea, analysis, scenario, history } = input;
  const prior = analysis.agents.find((a) => a.role === role);
  const yourPrior = prior
    ? `Your prior position: ${prior.stance} — "${prior.headline}"`
    : "";
  const historyBlock =
    history.length > 0
      ? `\nChanges already applied this session (cumulative, in order):\n${history
          .map((h, i) => `${i + 1}. ${h}`)
          .join("\n")}\n`
      : "";
  return `The board is evaluating this startup:\n"""${idea}"""\n\n${baselineContext(
    analysis,
  )}\n${yourPrior}\n${historyBlock}
The founder now proposes this change:\n"""${scenario}"""\n\nReact to THIS change through your own incentives. Return ONLY the JSON object.`;
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Run the Strategic Sandbox for a single proposed change: every board member
 * reacts through their own incentives (they may disagree), then the chair
 * synthesises winners / losers / tradeoffs / second-order effects and a net
 * delta to the board's score. Streams reactions as they land.
 */
export async function runStrategicSandbox(input: {
  idea: string;
  analysis: BoardAnalysis;
  scenario: string;
  history?: string[];
  options?: SandboxRunOptions;
}): Promise<SandboxResult> {
  const { idea, analysis, scenario } = input;
  const history = input.history ?? [];
  const provider = getProvider();
  const emit = (e: SandboxStreamEvent) => input.options?.onEvent?.(e);

  emit({ type: "status", message: `The board is reacting (${provider.name})…` });

  const reactions = await Promise.all(
    AGENT_ROLES.map(async (role): Promise<AgentReaction> => {
      emit({ type: "reaction_start", role });
      try {
        const raw: AgentReactionRaw = await provider.generateJSON({
          system: SANDBOX_PERSONAS[role],
          prompt: reactionPrompt({ role, idea, analysis, scenario, history }),
          schema: agentReactionSchema,
          schemaHint: REACTION_SCHEMA_HINT,
          temperature: 0.8,
          tag: `sandbox:${role}`,
        });
        const reaction: AgentReaction = { role, ...raw };
        emit({ type: "reaction_done", reaction });
        return reaction;
      } catch (err) {
        console.error(`[sandbox] reaction ${role} failed:`, err);
        const reaction: AgentReaction = {
          role,
          stance: "neutral",
          direction: "neutral",
          reaction: `${AGENTS[role].title} could not be reached.`,
          reasoning: "The model did not return a valid reaction for this seat.",
          intensity: 0,
        };
        emit({ type: "reaction_done", reaction });
        return reaction;
      }
    }),
  );

  let impact;
  try {
    impact = await provider.generateJSON({
      system: SANDBOX_IMPACT_SYSTEM,
      prompt: sandboxImpactPrompt({ idea, analysis, scenario, history, reactions }),
      schema: sandboxImpactSchema,
      schemaHint: SANDBOX_IMPACT_SCHEMA_HINT,
      temperature: 0.7,
      tag: "sandbox-impact",
    });
  } catch (err) {
    console.error("[sandbox] impact synthesis failed:", err);
    impact = {
      winners: [],
      losers: [],
      tradeoffs: [],
      secondOrder: [],
      netDelta: 0,
      verdict: "The board could not synthesise the impact of this change.",
    };
  }

  emit({ type: "impact", impact });

  const result: SandboxResult = { scenario, reactions, ...impact };
  emit({ type: "complete", result });
  return result;
}

function sandboxImpactPrompt(input: {
  idea: string;
  analysis: BoardAnalysis;
  scenario: string;
  history: string[];
  reactions: AgentReaction[];
}): string {
  const { idea, analysis, scenario, history, reactions } = input;
  const board = reactions
    .map(
      (r) =>
        `- ${AGENTS[r.role].title} [${r.direction}] (${r.stance}): ${r.reaction}`,
    )
    .join("\n");
  const historyBlock =
    history.length > 0
      ? `\nChanges already applied before this one (cumulative):\n${history
          .map((h, i) => `${i + 1}. ${h}`)
          .join("\n")}\n`
      : "";
  return `Startup under evaluation:\n"""${idea}"""\n\nBaseline board score: ${analysis.scorecard.overall}/100 (${analysis.scorecard.verdict}).${historyBlock}\nThe founder proposed this change:\n"""${scenario}"""\n\nThe board reacted:\n${board}\n\nSynthesise the board-level impact of this change. netDelta is the change to the ${analysis.scorecard.overall}/100 score (realistic range -25..+25). Return ONLY the JSON object.`;
}

/** Apply a netDelta to a baseline score, clamped to 0-100. */
export function applyNetDelta(baseline: number, netDelta: number): number {
  return clampScore(baseline + netDelta);
}
