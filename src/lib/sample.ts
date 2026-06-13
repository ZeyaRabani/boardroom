/**
 * Realistic sample board output. Used by:
 *  - the Mock LLM provider (so the app runs and demos with zero credentials)
 *  - the generative UI components for isolated previews / Storybook-style pages
 *
 * The sample idea: "Pulse — turns a flood of customer support tickets into a
 * ranked product roadmap automatically."
 */

import type {
  ActionPlanData,
  AgentAnalysis,
  BoardAnalysis,
  BoardMemoData,
  BoardSynthesis,
  CompetitorMapData,
  MVPRoadmapData,
  ScoreCardData,
} from "./types";

export const SAMPLE_IDEA =
  "Pulse: an AI tool that ingests a company's support tickets and turns them " +
  "into a prioritized product roadmap, so PMs stop guessing what to build next.";

export const SAMPLE_AGENT_ANALYSES: AgentAnalysis[] = [
  {
    role: "vc",
    headline: "Real wedge into PM tooling, but ‘roadmap’ is a graveyard.",
    analysis:
      "The support-ticket-to-roadmap insight is sharp and the wedge is real — " +
      "every PM team drowns in unstructured feedback. The risk is category: " +
      "‘roadmap tools’ has a graveyard of flat-growth companies. I want to see " +
      "a wedge that lands in the support org's budget first, then expands to " +
      "product.",
    stance: "bullish",
    risks: [
      {
        id: "vc-r1",
        title: "Crowded roadmap-tool category",
        description:
          "Productboard, Canny, Aha! and a dozen others already own the " +
          "‘prioritize what to build’ narrative.",
        severity: "high",
        likelihood: "high",
        category: "Market",
        mitigation:
          "Enter through support analytics (a different buyer/budget) before " +
          "fighting for the PM seat.",
        raisedBy: "vc",
      },
    ],
    opportunities: [
      {
        id: "vc-o1",
        title: "Land-and-expand from support to product",
        description:
          "Support leaders feel ticket pain acutely and have budget; product " +
          "is the expansion motion.",
        impact: "high",
        timeframe: "0-6 months",
        confidence: 68,
        raisedBy: "vc",
      },
    ],
    scores: [
      { label: "Market", score: 7, rationale: "Large but crowded." },
      { label: "Moat", score: 5, rationale: "Data network effects are plausible but unproven." },
    ],
  },
  {
    role: "cfo",
    headline: "LLM cost per ticket is the whole ballgame.",
    analysis:
      "Gross margin lives or dies on inference cost. If you summarize every " +
      "ticket with a frontier model you'll bleed at scale. Batch + small models " +
      "for triage, escalate to a big model only for clustering. Get COGS under " +
      "20% of ACV and this is a healthy SaaS.",
    stance: "neutral",
    risks: [
      {
        id: "cfo-r1",
        title: "Inference cost scales with ticket volume",
        description:
          "High-volume support orgs are exactly your ICP, and they generate the " +
          "most tokens — costs scale with the wrong axis.",
        severity: "high",
        likelihood: "medium",
        category: "Economics",
        mitigation:
          "Tiered models, embeddings for clustering, cache repeated intents, " +
          "price per seat not per ticket.",
        raisedBy: "cfo",
      },
    ],
    opportunities: [
      {
        id: "cfo-o1",
        title: "Usage-based upsell on volume",
        description:
          "Ticket volume is a natural expansion lever once value is proven.",
        impact: "medium",
        timeframe: "6-12 months",
        confidence: 60,
        raisedBy: "cfo",
      },
    ],
    scores: [
      { label: "Economics", score: 6, rationale: "Workable if COGS is controlled." },
      { label: "Capital efficiency", score: 7, rationale: "Software-only, no hardware." },
    ],
  },
  {
    role: "cto",
    headline: "Buildable in a weekend; clustering quality is the hard part.",
    analysis:
      "A thin slice is very buildable: ingest a CSV of tickets, embed, cluster, " +
      "rank by frequency × revenue of affected accounts. The hard, defensible " +
      "part is clustering quality and mapping themes to concrete roadmap items. " +
      "Start with one integration (Zendesk) and a CSV importer.",
    stance: "bullish",
    risks: [
      {
        id: "cto-r1",
        title: "Theme clustering accuracy",
        description:
          "Bad clusters destroy trust instantly; PMs will not act on noisy themes.",
        severity: "medium",
        likelihood: "medium",
        category: "Execution",
        mitigation:
          "Human-in-the-loop merge/split of clusters; show evidence tickets per theme.",
        raisedBy: "cto",
      },
    ],
    opportunities: [
      {
        id: "cto-o1",
        title: "Proprietary taxonomy of product themes",
        description:
          "A cross-customer theme taxonomy becomes a data moat over time.",
        impact: "high",
        timeframe: "12+ months",
        confidence: 55,
        raisedBy: "cto",
      },
    ],
    scores: [
      { label: "Feasibility", score: 9, rationale: "MVP is a weekend; depth takes months." },
      { label: "Technical moat", score: 5, rationale: "Moat accrues with data, not code." },
    ],
    roadmapPhases: [
      {
        id: "cto-p1",
        name: "Weekend prototype",
        timeframe: "Weekend",
        goal: "Prove ticket → theme → ranked roadmap on real data.",
        tasks: [
          { title: "CSV ticket importer" },
          { title: "Embed + cluster tickets into themes" },
          { title: "Rank themes by frequency × account value" },
          { title: "Render a ranked roadmap view" },
        ],
        outcome: "A demo that ranks real themes from a sample export.",
      },
      {
        id: "cto-p2",
        name: "Design partner",
        timeframe: "Weeks 1-3",
        goal: "Get one PM to run it on their real Zendesk data weekly.",
        tasks: [
          { title: "Zendesk OAuth integration" },
          { title: "Cluster merge/split (human-in-the-loop)" },
          { title: "Weekly digest email" },
        ],
        outcome: "One design partner using it in their planning ritual.",
      },
      {
        id: "cto-p3",
        name: "Paid pilot",
        timeframe: "Month 2",
        goal: "Convert the design partner to a paid seat-based plan.",
        tasks: [
          { title: "Seat-based billing" },
          { title: "Intercom + email connectors" },
          { title: "COGS controls: tiered models + caching" },
        ],
        outcome: "First revenue and a repeatable onboarding.",
      },
    ],
  },
  {
    role: "customer",
    headline: "PMs want this, but they won't trust a black box.",
    analysis:
      "I feel this pain weekly — I export tickets and tag them by hand. I'd pay " +
      "for this, but only if I can see WHY a theme ranked high and drill into the " +
      "actual tickets. If it's a black box, I won't put it in front of my VP.",
    stance: "bullish",
    risks: [
      {
        id: "cust-r1",
        title: "Trust / explainability gap",
        description:
          "PMs won't act on rankings they can't justify to leadership.",
        severity: "medium",
        likelihood: "high",
        category: "Adoption",
        mitigation: "Always show evidence tickets and the ranking formula.",
        raisedBy: "customer",
      },
    ],
    opportunities: [
      {
        id: "cust-o1",
        title: "Replace manual tagging workflows",
        description:
          "Teams currently burn hours tagging tickets in spreadsheets.",
        impact: "high",
        timeframe: "0-3 months",
        confidence: 72,
        raisedBy: "customer",
      },
    ],
    scores: [
      { label: "Demand", score: 8, rationale: "Acute, recurring, self-aware pain." },
      { label: "Willingness to pay", score: 7, rationale: "Replaces real labor hours." },
    ],
  },
  {
    role: "competitor",
    headline: "Incumbents are one feature away; speed is your only edge.",
    analysis:
      "Productboard and Zendesk could ship ‘AI theme detection’ as a feature. " +
      "Your edge is focus and speed: be the best-in-class ticket→roadmap engine " +
      "and integrate everywhere before they prioritize it.",
    stance: "neutral",
    risks: [
      {
        id: "comp-r1",
        title: "Platform feature risk",
        description:
          "Zendesk/Intercom bundling a ‘good enough’ version kills standalone value.",
        severity: "critical",
        likelihood: "medium",
        category: "Competitive",
        mitigation:
          "Be cross-platform and depth-first; own the workflow they treat as a checkbox.",
        raisedBy: "competitor",
      },
    ],
    opportunities: [
      {
        id: "comp-o1",
        title: "Cross-platform neutrality",
        description:
          "Unlike Zendesk-native tools, you can sit across Zendesk, Intercom, and email.",
        impact: "medium",
        timeframe: "3-9 months",
        confidence: 58,
        raisedBy: "competitor",
      },
    ],
    scores: [
      { label: "Defensibility", score: 4, rationale: "Feature risk from platforms is real." },
      { label: "Timing", score: 8, rationale: "LLM clustering is newly good enough." },
    ],
    competitors: [
      {
        id: "comp-c1",
        name: "Productboard",
        description: "Incumbent product-management & prioritization platform.",
        xAxis: 75,
        yAxis: 45,
        strength: "Brand, PM mindshare, integrations.",
        weakness: "Manual input; weak on raw support signal.",
        threatLevel: "high",
      },
      {
        id: "comp-c2",
        name: "Canny",
        description: "Feedback collection and feature voting.",
        xAxis: 45,
        yAxis: 35,
        strength: "Simple, loved by small teams.",
        weakness: "Voting ≠ ranked roadmap from real usage.",
        threatLevel: "medium",
      },
      {
        id: "comp-c3",
        name: "Zendesk (native AI)",
        description: "Support platform adding AI insights.",
        xAxis: 80,
        yAxis: 60,
        strength: "Owns the ticket data and the buyer.",
        weakness: "Zendesk-only; product team is not their buyer.",
        threatLevel: "critical",
      },
      {
        id: "comp-c4",
        name: "Manual spreadsheets",
        description: "The real status quo for most teams.",
        xAxis: 20,
        yAxis: 15,
        strength: "Free, flexible.",
        weakness: "Slow, biased, doesn't scale.",
        threatLevel: "low",
      },
    ],
  },
];

export const SAMPLE_SCORECARD: ScoreCardData = {
  overall: 68,
  verdict: "promising",
  dimensions: [
    { label: "Market", score: 7, rationale: "Large but crowded category." },
    { label: "Demand", score: 8, rationale: "Acute, recurring pain for PMs." },
    { label: "Feasibility", score: 9, rationale: "MVP is a weekend build." },
    { label: "Economics", score: 6, rationale: "Healthy if inference COGS is controlled." },
    { label: "Defensibility", score: 5, rationale: "Moat accrues from data over time." },
    { label: "Timing", score: 8, rationale: "LLM clustering just became good enough." },
  ],
  summary:
    "A fundable wedge with real demand and a fast MVP. The board's confidence is " +
    "gated on controlling inference costs and out-executing platform incumbents.",
};

export const SAMPLE_COMPETITOR_MAP: CompetitorMapData = {
  xAxisLabel: "Setup effort (low → high)",
  yAxisLabel: "Roadmap intelligence (low → high)",
  competitors: SAMPLE_AGENT_ANALYSES.find((a) => a.role === "competitor")!
    .competitors!,
  you: { name: "Pulse", xAxis: 30, yAxis: 85 },
  insight:
    "Pulse wins the top-left: low setup, high roadmap intelligence. Incumbents " +
    "are either high-effort or low-intelligence — defend that corner.",
};

export const SAMPLE_ROADMAP: MVPRoadmapData = {
  northStar: "A PM trusts Pulse's #1 ranked theme enough to put it on the roadmap.",
  phases: [
    {
      id: "p1",
      name: "Weekend prototype",
      timeframe: "Weekend",
      goal: "Prove ticket → theme → ranked roadmap on real data.",
      tasks: [
        { title: "CSV ticket importer" },
        { title: "Embed + cluster tickets into themes" },
        { title: "Rank by frequency × account value" },
        { title: "Ranked roadmap view with evidence tickets" },
      ],
      outcome: "A clickable demo that ranks real themes from a sample export.",
    },
    {
      id: "p2",
      name: "Design partner",
      timeframe: "Weeks 1-3",
      goal: "Get one PM to run it on their real Zendesk data weekly.",
      tasks: [
        { title: "Zendesk OAuth integration" },
        { title: "Cluster merge/split (human-in-the-loop)" },
        { title: "Weekly digest email" },
      ],
      outcome: "One design partner using it in their planning ritual.",
    },
    {
      id: "p3",
      name: "Paid pilot",
      timeframe: "Month 2",
      goal: "Convert design partner to a paid seat-based plan.",
      tasks: [
        { title: "Seat-based billing" },
        { title: "Intercom + email connectors" },
        { title: "COGS controls: tiered models + caching" },
      ],
      outcome: "First revenue and a repeatable onboarding.",
    },
  ],
};

export const SAMPLE_BOARD_ANALYSIS: BoardAnalysis = {
  idea: SAMPLE_IDEA,
  agents: SAMPLE_AGENT_ANALYSES,
  scorecard: SAMPLE_SCORECARD,
  risks: SAMPLE_AGENT_ANALYSES.flatMap((a) => a.risks),
  opportunities: SAMPLE_AGENT_ANALYSES.flatMap((a) => a.opportunities),
  competitorMap: SAMPLE_COMPETITOR_MAP,
  roadmap: SAMPLE_ROADMAP,
};

export const SAMPLE_MEMO: BoardMemoData = {
  title: "Board Memo — Pulse",
  date: "2026-06-13",
  recommendation: "explore",
  thesis:
    "Pulse turns the highest-volume, lowest-structure data a company owns — " +
    "support tickets — into a ranked, evidence-backed roadmap. The pain is " +
    "acute and the MVP is days, not months.",
  keyRisks: [
    "Crowded roadmap-tool category with platform feature risk (Zendesk/Intercom).",
    "Inference COGS scales with ticket volume — the wrong axis.",
    "Trust gap: PMs won't act on un-explainable rankings.",
  ],
  keyOpportunities: [
    "Land in the support budget, expand to product (land-and-expand).",
    "Cross-platform neutrality vs. single-platform incumbents.",
    "Data-driven theme taxonomy as a compounding moat.",
  ],
  conditions: [
    "Keep blended inference COGS under 20% of ACV.",
    "Every ranking shows evidence tickets and the formula.",
    "Ship one integration deeply before going broad.",
  ],
  verdict:
    "Explore with a design partner. Prove that a PM trusts and acts on the #1 " +
    "ranked theme; that single signal de-risks the whole thesis.",
  confidence: 68,
};

export const SAMPLE_ACTION_PLAN: ActionPlanData = {
  title: "Prove It This Weekend",
  goal: "Show that Pulse ranks a theme a real PM would put on their roadmap.",
  timeframe: "This weekend",
  items: [
    {
      id: "a1",
      title: "Get a real ticket export",
      description:
        "Pull 500-2000 anonymized tickets (yours, a friend's company, or a public dataset).",
      effort: "S",
      priority: "P0",
      day: "Sat AM",
    },
    {
      id: "a2",
      title: "Embed + cluster into themes",
      description:
        "Embed tickets, cluster, and label each cluster with a short theme name.",
      effort: "M",
      priority: "P0",
      day: "Sat PM",
    },
    {
      id: "a3",
      title: "Rank themes",
      description:
        "Score themes by frequency × value of affected accounts; show evidence tickets.",
      effort: "M",
      priority: "P0",
      day: "Sun AM",
    },
    {
      id: "a4",
      title: "Show 3 PMs and ask one question",
      description:
        "‘Would you put the #1 theme on your roadmap?’ Count yes/no — that's your signal.",
      effort: "S",
      priority: "P1",
      day: "Sun PM",
    },
  ],
  successMetric:
    "At least 2 of 3 PMs say they'd act on the #1 ranked theme.",
};

export const SAMPLE_SYNTHESIS: BoardSynthesis = {
  memo: SAMPLE_MEMO,
  actionPlan: SAMPLE_ACTION_PLAN,
};
