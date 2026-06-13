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
  AgentReaction,
  AgentRole,
  BoardAnalysis,
  BoardMemoData,
  BoardSynthesis,
  CompetitorMapData,
  MVPRoadmapData,
  SandboxResult,
  ScoreCardData,
} from "./types";

export const SAMPLE_IDEA =
  "Pulse: an AI tool that ingests a company's support tickets and turns them " +
  "into a prioritized product roadmap, so PMs stop guessing what to build next.";

export const SAMPLE_AGENT_ANALYSES: AgentAnalysis[] = [
  /* ── VC (Vega Capital) ─────────────────────────────────────────────────── */
  {
    role: "vc",
    headline:
      "This is the Gong playbook for product teams — big wedge, clear expansion, and the timing is now.",
    analysis:
      "The support-ticket-to-roadmap insight is a genuine wedge into the $15B+ " +
      "product-management tooling market. Pattern-match: Gong turned raw sales " +
      "calls into pipeline intelligence and hit $100M ARR in 4 years — Pulse does " +
      "the same thing with support tickets for PMs. The 'why now' is clear: LLMs " +
      "can reliably cluster and summarize unstructured text at <$0.01/ticket. Land " +
      "in the support leader's budget first (they feel the pain), then expand to " +
      "product. I'd take the meeting.",
    stance: "bullish",
    risks: [
      {
        id: "vc-r1",
        title: "Crowded roadmap-tool graveyard",
        description:
          "Productboard ($100M+ ARR), Canny, Aha!, and a dozen others already " +
          "own the 'prioritize what to build' narrative. VCs have funded and " +
          "written off multiple entrants.",
        severity: "high",
        likelihood: "high",
        category: "Market",
        mitigation:
          "Enter through support analytics — a different buyer and budget — " +
          "before competing head-on for the PM seat.",
        raisedBy: "vc",
      },
      {
        id: "vc-r2",
        title: "Single-channel data dependency",
        description:
          "If Zendesk or Intercom restricts API access or raises pricing, " +
          "Pulse loses its data lifeline overnight.",
        severity: "medium",
        likelihood: "medium",
        category: "Platform",
        mitigation:
          "Support CSV import from day one, add email and Slack connectors " +
          "early to reduce single-platform dependence.",
        raisedBy: "vc",
      },
    ],
    opportunities: [
      {
        id: "vc-o1",
        title: "Land-and-expand from support to product",
        description:
          "Support leaders feel ticket pain acutely and have discretionary " +
          "budget ($5-20K/yr range). Once value is proven, expansion into the " +
          "product org is a natural upsell motion.",
        impact: "high",
        timeframe: "0-6 months",
        confidence: 70,
        raisedBy: "vc",
      },
      {
        id: "vc-o2",
        title: "Vertical expansion into sales and NPS feedback",
        description:
          "The same embed-cluster-rank pipeline works on sales call transcripts, " +
          "NPS verbatims, and app store reviews — each a new product line.",
        impact: "medium",
        timeframe: "12+ months",
        confidence: 55,
        raisedBy: "vc",
      },
    ],
    scores: [
      {
        label: "Market",
        score: 7,
        rationale:
          "PM tooling + support analytics combined TAM is $15B+, but the " +
          "roadmap sub-segment is crowded. The wedge through support is the " +
          "differentiator.",
      },
      {
        label: "Moat",
        score: 5,
        rationale:
          "Data network effects are plausible — a cross-customer theme taxonomy " +
          "compounds over time — but nothing stops a well-funded incumbent from " +
          "replicating the pipeline.",
      },
    ],
  },

  /* ── CFO (Numa Sterling) ───────────────────────────────────────────────── */
  {
    role: "cfo",
    headline:
      "Unit economics work at $18K ACV if blended inference stays under $0.003/ticket — but that margin is thinner than it looks.",
    analysis:
      "Model the math: a mid-market customer generates ~5,000 tickets/month. At " +
      "$0.003 blended inference cost per ticket (embed + cluster + summarize), " +
      "that's $15/mo COGS — on a $1,500/mo ACV, gross margin is 99%. The catch: " +
      "frontier-model summarization pushes per-ticket cost to $0.05, cratering " +
      "margin to 83% before infra. Batch triage with a small model, escalate " +
      "clustering to a bigger one, and price per seat ($300/seat/mo) not per " +
      "ticket. Break-even at ~30 paying accounts.",
    stance: "neutral",
    risks: [
      {
        id: "cfo-r1",
        title: "Inference COGS scales with ticket volume",
        description:
          "High-volume support orgs are exactly the ICP, and they generate " +
          "the most tokens. Revenue is per-seat but cost is per-ticket — the " +
          "mismatch is dangerous at scale.",
        severity: "high",
        likelihood: "medium",
        category: "Economics",
        mitigation:
          "Tiered model routing: embeddings for clustering ($0.0001/ticket), " +
          "small model for triage, frontier model only for theme summaries. " +
          "Cache repeated intent patterns aggressively.",
        raisedBy: "cfo",
      },
      {
        id: "cfo-r2",
        title: "SMB pricing pressure below $200/mo",
        description:
          "SMBs with 500 tickets/month will balk at $300/seat pricing, but " +
          "per-ticket pricing at their volume barely covers COGS.",
        severity: "medium",
        likelihood: "high",
        category: "Pricing",
        mitigation:
          "Launch mid-market only (5,000+ tickets/mo). Add a self-serve SMB " +
          "tier later with a thinner feature set and aggressive caching.",
        raisedBy: "cfo",
      },
    ],
    opportunities: [
      {
        id: "cfo-o1",
        title: "Usage-based expansion revenue",
        description:
          "Ticket volume is a natural expansion lever — as customers grow " +
          "or connect more channels, ACV increases without new sales effort.",
        impact: "medium",
        timeframe: "6-12 months",
        confidence: 62,
        raisedBy: "cfo",
      },
      {
        id: "cfo-o2",
        title: "90%+ gross margin at scale with model optimization",
        description:
          "If inference cost halves yearly (current trend), gross margin " +
          "improves to 95%+ within 18 months even without price increases.",
        impact: "high",
        timeframe: "12+ months",
        confidence: 58,
        raisedBy: "cfo",
      },
    ],
    scores: [
      {
        label: "Economics",
        score: 6,
        rationale:
          "Workable unit economics if COGS stays under $0.003/ticket. The " +
          "per-seat vs. per-ticket mismatch needs active management.",
      },
      {
        label: "Capital efficiency",
        score: 7,
        rationale:
          "Software-only, no hardware. A two-person team can reach $50K MRR " +
          "with 30 mid-market accounts. Low burn if bootstrapped.",
      },
    ],
  },

  /* ── CTO (AdaKernel) ───────────────────────────────────────────────────── */
  {
    role: "cto",
    headline:
      "Weekend-buildable core with one genuinely hard problem — clustering quality is the moat, not the code.",
    analysis:
      "The MVP pipeline is straightforward: ingest CSV → embed with " +
      "text-embedding-3-small → HDBSCAN cluster → rank by frequency × account " +
      "MRR → render a ranked list with evidence tickets. A competent engineer " +
      "ships this in 48 hours. The hard, defensible problem is cluster quality: " +
      "noisy themes destroy PM trust instantly. Human-in-the-loop merge/split " +
      "and per-customer feedback loops are what separate a toy from a product.",
    stance: "bullish",
    risks: [
      {
        id: "cto-r1",
        title: "Theme clustering accuracy",
        description:
          "HDBSCAN on raw embeddings produces noisy, overlapping clusters. " +
          "PMs will not act on themes they don't understand or trust.",
        severity: "medium",
        likelihood: "medium",
        category: "Execution",
        mitigation:
          "Human-in-the-loop merge/split UI, show evidence tickets per theme, " +
          "and let PMs rename/reject clusters. Feed corrections back into a " +
          "fine-tuned embedding model over time.",
        raisedBy: "cto",
      },
      {
        id: "cto-r2",
        title: "Integration maintenance burden",
        description:
          "Every ticketing platform (Zendesk, Intercom, Freshdesk, HubSpot) " +
          "has a different schema, auth flow, and rate limit. Maintaining 4+ " +
          "connectors is a full-time job.",
        severity: "medium",
        likelihood: "high",
        category: "Execution",
        mitigation:
          "Start with CSV import + one integration (Zendesk). Use a unified " +
          "internal ticket schema and build an abstraction layer before adding " +
          "the next connector.",
        raisedBy: "cto",
      },
    ],
    opportunities: [
      {
        id: "cto-o1",
        title: "Proprietary cross-customer theme taxonomy",
        description:
          "As more customers merge/correct clusters, Pulse builds a proprietary " +
          "taxonomy of product themes that no competitor can replicate from " +
          "scratch — a genuine data moat.",
        impact: "high",
        timeframe: "12+ months",
        confidence: 55,
        raisedBy: "cto",
      },
      {
        id: "cto-o2",
        title: "Real-time webhook streaming for live roadmap",
        description:
          "Once Zendesk/Intercom webhooks are live, Pulse can update the ranked " +
          "roadmap in real time — a compelling demo that no batch-processing " +
          "competitor can match.",
        impact: "medium",
        timeframe: "3-6 months",
        confidence: 65,
        raisedBy: "cto",
      },
    ],
    scores: [
      {
        label: "Feasibility",
        score: 9,
        rationale:
          "Core pipeline is a weekend build with off-the-shelf models. " +
          "Production-grade clustering quality takes months, but the MVP " +
          "is immediate.",
      },
      {
        label: "Technical moat",
        score: 5,
        rationale:
          "The code is commodity. Moat accrues from customer-corrected cluster " +
          "data and a cross-org theme taxonomy — both require sustained usage.",
      },
    ],
    roadmapPhases: [
      {
        id: "cto-p1",
        name: "Weekend prototype",
        timeframe: "Weekend",
        goal: "Prove ticket → theme → ranked roadmap on real data.",
        tasks: [
          {
            title: "CSV ticket importer",
            description:
              "Parse Zendesk/Intercom CSV exports into a unified ticket schema " +
              "(subject, body, account, timestamp).",
          },
          {
            title: "Embed + cluster tickets into themes",
            description:
              "Embed with text-embedding-3-small, cluster with HDBSCAN, label " +
              "each cluster using an LLM summary of its top-5 tickets.",
          },
          {
            title: "Rank themes by frequency × account value",
            description:
              "Score each theme: (ticket count) × (sum of affected account MRR). " +
              "Surface the top 10 with evidence tickets.",
          },
          {
            title: "Render a ranked roadmap view",
            description:
              "A single-page Next.js app showing themes ranked by score, each " +
              "expandable to show contributing tickets.",
          },
        ],
        outcome:
          "A clickable demo that turns a 2,000-ticket CSV into a ranked, " +
          "evidence-backed theme list in under 60 seconds.",
      },
      {
        id: "cto-p2",
        name: "Design partner sprint",
        timeframe: "Weeks 1-3",
        goal: "Get one PM to use Pulse on their live Zendesk data weekly.",
        tasks: [
          {
            title: "Zendesk OAuth integration",
            description:
              "Connect to Zendesk via OAuth2, sync tickets incrementally " +
              "via the Incremental Exports API.",
          },
          {
            title: "Cluster merge/split UI",
            description:
              "Let PMs drag-to-merge overlapping themes and split noisy ones. " +
              "Store corrections for future clustering runs.",
          },
          {
            title: "Weekly digest email",
            description:
              "Auto-send a Monday morning email: top 5 themes this week, " +
              "change vs. last week, new high-value tickets.",
          },
        ],
        outcome:
          "One design partner integrates Pulse into their weekly planning " +
          "ritual and gives a testimonial quote.",
      },
      {
        id: "cto-p3",
        name: "Paid pilot",
        timeframe: "Month 2",
        goal: "Convert design partner to paid; onboard 2 more accounts.",
        tasks: [
          {
            title: "Seat-based billing via Stripe",
            description:
              "Implement per-seat pricing with Stripe Checkout. Free trial → " +
              "paid conversion flow.",
          },
          {
            title: "Intercom + email connectors",
            description:
              "Add Intercom webhook ingestion and a forwarding email address " +
              "for teams not on Zendesk/Intercom.",
          },
          {
            title: "COGS optimization: tiered model routing",
            description:
              "Route ticket classification to a small model, use frontier " +
              "model only for theme summarization. Cache repeated intents.",
          },
        ],
        outcome:
          "First paying customer, blended COGS under $0.003/ticket, and a " +
          "repeatable 30-minute onboarding flow.",
      },
    ],
  },

  /* ── Customer (Remi Buyer) ─────────────────────────────────────────────── */
  {
    role: "customer",
    headline:
      "I spend 6 hours every week tagging tickets in a spreadsheet — take my money, but show me the receipts.",
    analysis:
      "Every Monday I export last week's Zendesk tickets, read through 200+ of " +
      "them, and manually tag themes in Google Sheets. It takes me 6 hours and " +
      "the output is stale by Wednesday. I would pay $300-500/mo to automate " +
      "this — that's less than one hour of my time per week. But I will not put " +
      "an AI-generated roadmap in front of my VP unless I can click into every " +
      "theme and see the actual tickets that support it.",
    stance: "bullish",
    risks: [
      {
        id: "cust-r1",
        title: "Trust and explainability gap",
        description:
          "If the ranked themes feel like a black box, I won't stake my " +
          "credibility on them. PMs need to justify prioritization decisions " +
          "to leadership with evidence, not vibes.",
        severity: "high",
        likelihood: "high",
        category: "Adoption",
        mitigation:
          "Every theme must link to its evidence tickets, show the ranking " +
          "formula, and let me override or adjust weights.",
        raisedBy: "customer",
      },
      {
        id: "cust-r2",
        title: "Cold-start quality on first upload",
        description:
          "The first time I upload, will the themes actually make sense for " +
          "my product? Or will I get generic clusters like 'bug reports' and " +
          "'feature requests' that tell me nothing?",
        severity: "medium",
        likelihood: "medium",
        category: "Adoption",
        mitigation:
          "Provide an interactive onboarding where I can review and correct " +
          "the initial clustering before it becomes my baseline.",
        raisedBy: "customer",
      },
    ],
    opportunities: [
      {
        id: "cust-o1",
        title: "Replace 6+ hours/week of manual tagging",
        description:
          "Direct time savings that any PM can quantify for their manager. " +
          "At $75/hr loaded cost, that's $1,800/mo in recovered labor per PM.",
        impact: "high",
        timeframe: "0-3 months",
        confidence: 75,
        raisedBy: "customer",
      },
      {
        id: "cust-o2",
        title: "Become the PM's weekly planning ritual",
        description:
          "If Pulse's Monday digest replaces my spreadsheet, it becomes the " +
          "system of record for what to build — sticky and hard to churn from.",
        impact: "high",
        timeframe: "3-6 months",
        confidence: 65,
        raisedBy: "customer",
      },
    ],
    scores: [
      {
        label: "Demand",
        score: 8,
        rationale:
          "Acute, recurring, weekly pain that every PM at a company with " +
          ">1,000 tickets/month feels. Self-aware problem with an existing " +
          "manual workaround (spreadsheets).",
      },
      {
        label: "Willingness to pay",
        score: 7,
        rationale:
          "I'd pay $300-500/mo immediately. That's well within a PM lead's " +
          "discretionary budget. Larger teams would pay $1,500/mo+ for a " +
          "team license.",
      },
    ],
  },

  /* ── Competitor (Rival Watch) ──────────────────────────────────────────── */
  {
    role: "competitor",
    headline:
      "The graveyard is real — Productboard has $100M+ ARR and Zendesk ships AI quarterly. Speed is your only edge, and it depreciates fast.",
    analysis:
      "The competitive landscape is a minefield. Productboard owns the PM " +
      "prioritization narrative with 8,000+ customers. Zendesk is adding AI " +
      "Agents and intelligent triage — they already own the ticket data and the " +
      "buyer relationship. Canny and Aha! occupy adjacent niches. The opening: " +
      "none of them do **ticket → ranked roadmap** as a single, opinionated " +
      "workflow. Pulse's window is 12-18 months before incumbents catch up.",
    stance: "bearish",
    risks: [
      {
        id: "comp-r1",
        title: "Platform feature risk from Zendesk/Intercom",
        description:
          "Zendesk's AI Agent suite already clusters tickets. If they add " +
          "'suggest roadmap priorities' as a native feature, standalone Pulse " +
          "loses its primary wedge overnight.",
        severity: "critical",
        likelihood: "medium",
        category: "Competitive",
        mitigation:
          "Be cross-platform from month 2. Depth-first: own the full " +
          "ticket→theme→roadmap→action workflow that platforms will treat " +
          "as a checkbox.",
        raisedBy: "competitor",
      },
      {
        id: "comp-r2",
        title: "Productboard acqui-hires or builds the feature",
        description:
          "Productboard has $200M+ in funding, a PM-buyer relationship, " +
          "and 'AI insights' on their roadmap. An acquisition or 90-day " +
          "sprint kills the standalone opportunity.",
        severity: "high",
        likelihood: "medium",
        category: "Competitive",
        mitigation:
          "Move faster than their product cycle. Land 50 paying accounts " +
          "before they ship — at that point, Pulse becomes an acquisition " +
          "target rather than a feature.",
        raisedBy: "competitor",
      },
      {
        id: "comp-r3",
        title: "Open-source commoditization",
        description:
          "An embed-cluster-rank pipeline is ~200 lines of Python. A viral " +
          "open-source project or a Langchain template could commoditize the " +
          "core instantly.",
        severity: "medium",
        likelihood: "medium",
        category: "Competitive",
        mitigation:
          "The moat is not the pipeline — it's the integrations, the PM-facing " +
          "workflow, and the cross-customer theme taxonomy. Open source can't " +
          "replicate customer data.",
        raisedBy: "competitor",
      },
    ],
    opportunities: [
      {
        id: "comp-o1",
        title: "Cross-platform neutrality as differentiator",
        description:
          "Unlike Zendesk-native or Intercom-native tools, Pulse can sit " +
          "across all ticketing systems — a compelling value prop for companies " +
          "with multiple support channels.",
        impact: "medium",
        timeframe: "3-9 months",
        confidence: 60,
        raisedBy: "competitor",
      },
      {
        id: "comp-o2",
        title: "First-mover in ticket-to-roadmap category",
        description:
          "Nobody owns 'ticket → roadmap' as a category yet. Pulse can define " +
          "it and capture the SEO, analyst mindshare, and G2 category page " +
          "before others show up.",
        impact: "high",
        timeframe: "0-6 months",
        confidence: 50,
        raisedBy: "competitor",
      },
    ],
    scores: [
      {
        label: "Defensibility",
        score: 4,
        rationale:
          "Feature risk from platforms is real and imminent. The only durable " +
          "defense is speed, cross-platform presence, and a data moat from " +
          "customer corrections.",
      },
      {
        label: "Timing",
        score: 8,
        rationale:
          "LLM clustering and summarization just crossed the quality threshold " +
          "in 2024-2025. The window is open now but closes as incumbents " +
          "integrate the same models.",
      },
    ],
    competitors: [
      {
        id: "comp-c1",
        name: "Productboard",
        description:
          "Market-leading product management platform with AI-powered " +
          "prioritization, used by 8,000+ companies.",
        xAxis: 55,
        yAxis: 50,
        strength:
          "Deep PM workflow, brand recognition, $200M+ funding, 150+ integrations.",
        weakness:
          "Relies on manual input and customer portal votes — weak on raw " +
          "support ticket signal.",
        threatLevel: "high",
      },
      {
        id: "comp-c2",
        name: "Canny",
        description:
          "Feature-request voting board and feedback collection tool popular " +
          "with small to mid-size SaaS teams.",
        xAxis: 70,
        yAxis: 25,
        strength:
          "Simple, fast to set up, loved by small teams. Clean public-facing " +
          "feedback portal.",
        weakness:
          "Voting ≠ intelligence. Counts feature requests but doesn't analyze " +
          "support ticket themes or weight by account value.",
        threatLevel: "medium",
      },
      {
        id: "comp-c3",
        name: "Zendesk AI (native)",
        description:
          "Zendesk's built-in AI suite: intelligent triage, AI agents, and " +
          "generative reply suggestions — expanding quarterly.",
        xAxis: 85,
        yAxis: 55,
        strength:
          "Owns the ticket data, the buyer relationship, and the support " +
          "budget. Zero switching cost for existing Zendesk customers.",
        weakness:
          "Zendesk-only. Product teams are not their primary buyer. Roadmap " +
          "prioritization is not their core focus.",
        threatLevel: "critical",
      },
      {
        id: "comp-c4",
        name: "Intercom Fin + Insights",
        description:
          "Intercom's AI support agent (Fin) with emerging analytics and " +
          "topic detection capabilities.",
        xAxis: 75,
        yAxis: 40,
        strength:
          "Strong in conversational support. Fin already classifies intent. " +
          "Growing mid-market customer base.",
        weakness:
          "Focused on support resolution, not product roadmapping. Topic " +
          "detection is shallow — no ranked prioritization.",
        threatLevel: "high",
      },
      {
        id: "comp-c5",
        name: "Manual spreadsheets",
        description:
          "The real status quo: PMs manually export tickets and tag themes " +
          "in Google Sheets or Notion on a weekly basis.",
        xAxis: 25,
        yAxis: 10,
        strength:
          "Free, infinitely flexible, requires no IT approval or new tool " +
          "adoption.",
        weakness:
          "Slow (6+ hrs/week), biased toward recent tickets, doesn't scale " +
          "past 500 tickets/week, output is stale by mid-week.",
        threatLevel: "low",
      },
    ],
  },
];

/* ── Scorecard ─────────────────────────────────────────────────────────── */

export const SAMPLE_SCORECARD: ScoreCardData = {
  overall: 72,
  verdict: "promising",
  dimensions: [
    {
      label: "Market",
      score: 7,
      rationale:
        "PM tooling + support analytics TAM is $15B+. The roadmap sub-segment " +
        "is crowded, but the support-first wedge opens a less contested entry.",
    },
    {
      label: "Demand",
      score: 8,
      rationale:
        "Acute, recurring weekly pain for PMs at companies with 1,000+ " +
        "tickets/month. Existing workaround (spreadsheets) is universally " +
        "hated.",
    },
    {
      label: "Feasibility",
      score: 9,
      rationale:
        "Core pipeline is a weekend build with off-the-shelf embedding and " +
        "clustering models. Production quality takes months, but the demo is " +
        "immediate.",
    },
    {
      label: "Economics",
      score: 6,
      rationale:
        "Healthy unit economics at mid-market ACV ($18K/yr) if blended " +
        "inference cost stays under $0.003/ticket. Requires active COGS " +
        "management.",
    },
    {
      label: "Defensibility",
      score: 5,
      rationale:
        "Code is commodity. Moat accrues from cross-customer theme taxonomy " +
        "and PM correction data — real but slow to build.",
    },
    {
      label: "Timing",
      score: 8,
      rationale:
        "LLM clustering crossed the quality threshold in 2024-2025. 12-18 " +
        "month window before Zendesk/Productboard ship native versions.",
    },
  ],
  summary:
    "A fundable wedge with acute demand and a fast MVP path. Board confidence " +
    "is gated on controlling inference COGS, earning PM trust through " +
    "explainability, and out-executing platform incumbents within the 12-18 " +
    "month timing window.",
};

/* ── Competitor map ────────────────────────────────────────────────────── */

export const SAMPLE_COMPETITOR_MAP: CompetitorMapData = {
  xAxisLabel: "Ease of adoption (hard → easy)",
  yAxisLabel: "Roadmap intelligence (low → high)",
  competitors: SAMPLE_AGENT_ANALYSES.find((a) => a.role === "competitor")!
    .competitors!,
  you: { name: "Pulse", xAxis: 75, yAxis: 90 },
  insight:
    "Pulse occupies the high-ease, high-intelligence corner that no incumbent " +
    "fills. Productboard has intelligence but requires heavy setup; Zendesk " +
    "AI is easy but shallow on roadmap insight. Defend this position by " +
    "staying cross-platform and depth-first on the ticket→roadmap workflow.",
};

/* ── MVP roadmap ───────────────────────────────────────────────────────── */

export const SAMPLE_ROADMAP: MVPRoadmapData = {
  northStar:
    "A PM trusts Pulse's #1 ranked theme enough to put it on their " +
    "sprint board without second-guessing.",
  phases: [
    {
      id: "p1",
      name: "Weekend prototype",
      timeframe: "Weekend",
      goal: "Prove ticket → theme → ranked roadmap on real data.",
      tasks: [
        {
          title: "CSV ticket importer",
          description:
            "Parse Zendesk/Intercom CSV exports into a unified ticket schema.",
        },
        {
          title: "Embed + cluster tickets into themes",
          description:
            "text-embedding-3-small → HDBSCAN → LLM-labeled cluster names.",
        },
        {
          title: "Rank themes by frequency × account value",
          description:
            "Score = (ticket count) × (sum of affected account MRR). " +
            "Surface top 10.",
        },
        {
          title: "Ranked roadmap view with evidence tickets",
          description:
            "Single-page app: themes ranked by score, expandable to " +
            "show contributing tickets.",
        },
      ],
      outcome:
        "A clickable demo that turns a 2,000-ticket CSV into a ranked " +
        "theme list in under 60 seconds.",
    },
    {
      id: "p2",
      name: "Design partner sprint",
      timeframe: "Weeks 1-3",
      goal: "Get one PM to use Pulse on their live Zendesk data weekly.",
      tasks: [
        {
          title: "Zendesk OAuth integration",
          description:
            "Incremental Exports API sync with automatic deduplication.",
        },
        {
          title: "Cluster merge/split UI",
          description:
            "Drag-to-merge overlapping themes, split noisy clusters, " +
            "store corrections for future runs.",
        },
        {
          title: "Weekly digest email",
          description:
            "Monday AM email: top 5 themes, week-over-week trend, " +
            "new high-value tickets.",
        },
      ],
      outcome:
        "One design partner uses Pulse in their weekly planning ritual " +
        "and gives a testimonial quote.",
    },
    {
      id: "p3",
      name: "Paid pilot",
      timeframe: "Month 2",
      goal: "Convert design partner to paid; onboard 2 more accounts.",
      tasks: [
        {
          title: "Seat-based billing via Stripe",
          description:
            "Per-seat pricing with Stripe Checkout. Free trial → paid flow.",
        },
        {
          title: "Intercom + email connectors",
          description:
            "Intercom webhook ingestion + forwarding email for non-Zendesk teams.",
        },
        {
          title: "COGS optimization: tiered model routing",
          description:
            "Small model for triage, frontier for summaries, aggressive " +
            "intent caching.",
        },
      ],
      outcome:
        "First paying customer, blended COGS under $0.003/ticket, and a " +
        "repeatable 30-minute onboarding flow.",
    },
  ],
};

/* ── Board analysis (aggregate) ────────────────────────────────────────── */

export const SAMPLE_BOARD_ANALYSIS: BoardAnalysis = {
  idea: SAMPLE_IDEA,
  agents: SAMPLE_AGENT_ANALYSES,
  scorecard: SAMPLE_SCORECARD,
  risks: SAMPLE_AGENT_ANALYSES.flatMap((a) => a.risks),
  opportunities: SAMPLE_AGENT_ANALYSES.flatMap((a) => a.opportunities),
  competitorMap: SAMPLE_COMPETITOR_MAP,
  roadmap: SAMPLE_ROADMAP,
};

/* ── Board memo ────────────────────────────────────────────────────────── */

export const SAMPLE_MEMO: BoardMemoData = {
  title: "Board Memo — Pulse",
  date: "2026-06-13",
  recommendation: "explore",
  thesis:
    "Pulse converts the highest-volume, lowest-structure data a company " +
    "owns — support tickets — into a ranked, evidence-backed product roadmap. " +
    "The pain is acute (6+ hrs/week manual tagging), the MVP is days not " +
    "months, and the timing is right: LLM clustering just crossed the quality " +
    "threshold. The risk profile is manageable if the team moves fast.",
  keyRisks: [
    "Crowded roadmap-tool category with well-funded incumbents (Productboard, Canny, Aha!).",
    "Platform feature risk: Zendesk/Intercom could bundle a 'good enough' version quarterly.",
    "Inference COGS scales with ticket volume — the per-seat pricing vs. per-ticket cost mismatch needs active management.",
    "PM trust gap: rankings without evidence are DOA — explainability is table stakes, not a feature.",
  ],
  keyOpportunities: [
    "Land in the support leader's budget, expand to the product org (land-and-expand).",
    "Cross-platform neutrality vs. single-platform incumbents (Zendesk-only, Intercom-only).",
    "Proprietary cross-customer theme taxonomy as a compounding data moat.",
    "First-mover to define and own the 'ticket-to-roadmap' category.",
  ],
  conditions: [
    "Keep blended inference COGS under $0.003/ticket via tiered model routing and intent caching.",
    "Every ranked theme must show evidence tickets, the ranking formula, and allow PM overrides.",
    "Ship Zendesk integration deeply before going broad — own one channel end-to-end first.",
    "Land a design partner within 3 weeks who uses Pulse in their actual weekly planning ritual.",
  ],
  verdict:
    "Explore with urgency. The board recommends a weekend prototype → design " +
    "partner sprint → paid pilot sequence. The single de-risking signal: does " +
    "a real PM trust and act on the #1 ranked theme? Prove that, and the " +
    "thesis holds.",
  confidence: 72,
};

/* ── Weekend action plan ───────────────────────────────────────────────── */

export const SAMPLE_ACTION_PLAN: ActionPlanData = {
  title: "48-Hour Proof of Concept",
  goal: "Demonstrate that Pulse can turn a real ticket export into a ranked theme list that a PM would actually act on.",
  timeframe: "This weekend",
  items: [
    {
      id: "a1",
      title: "Source a real ticket dataset",
      description:
        "Get 1,000-2,000 anonymized support tickets — your own Zendesk export, " +
        "a friend's company, or a public customer support dataset (e.g., " +
        "Kaggle's Twitter support corpus).",
      owner: "Founder",
      effort: "S",
      priority: "P0",
      day: "Sat AM",
    },
    {
      id: "a2",
      title: "Build the embed + cluster pipeline",
      description:
        "Embed tickets with text-embedding-3-small, cluster with HDBSCAN, and " +
        "auto-label each cluster using a frontier model summary of its top 5 " +
        "tickets. Output: a JSON of ranked themes with evidence.",
      owner: "CTO",
      effort: "M",
      priority: "P0",
      day: "Sat PM",
    },
    {
      id: "a3",
      title: "Rank themes and build the demo UI",
      description:
        "Score themes by frequency × account value. Render a single-page " +
        "ranked list where each theme expands to show contributing tickets " +
        "and the ranking formula.",
      owner: "CTO",
      effort: "M",
      priority: "P0",
      day: "Sun AM",
    },
    {
      id: "a4",
      title: "Run the demo with 3 PMs",
      description:
        "Show the ranked output to 3 PMs (friends, ex-colleagues, design " +
        "partner candidates). Ask one question: 'Would you put the #1 theme " +
        "on your sprint board?' Record yes/no and their reasoning.",
      owner: "Founder",
      effort: "S",
      priority: "P0",
      day: "Sun PM",
    },
    {
      id: "a5",
      title: "Measure COGS and log model costs",
      description:
        "Instrument the pipeline to log tokens consumed and cost per ticket. " +
        "Validate that blended cost is under $0.005/ticket before optimization.",
      owner: "CTO",
      effort: "S",
      priority: "P1",
      day: "Sun PM",
    },
  ],
  successMetric:
    "At least 2 of 3 PMs say they would act on the #1 ranked theme, and " +
    "blended inference cost is under $0.005/ticket.",
};

/* ── Final synthesis ───────────────────────────────────────────────────── */

export const SAMPLE_SYNTHESIS: BoardSynthesis = {
  memo: SAMPLE_MEMO,
  actionPlan: SAMPLE_ACTION_PLAN,
};

/* ── Strategic Sandbox (demo "what-if": cut prices by 50%) ─────────────────── */

export const SAMPLE_SANDBOX_REACTIONS: Record<AgentRole, AgentReaction> = {
  vc: {
    role: "vc",
    stance: "bullish",
    direction: "up",
    reaction: "Cheaper price, faster land-grab — I like the wedge.",
    reasoning:
      "Halving price accelerates logo acquisition and data accumulation, which compounds the roadmap moat. The bigger top-of-funnel is exactly the venture-scale dynamic I want.",
    intensity: 78,
  },
  cfo: {
    role: "cfo",
    stance: "bearish",
    direction: "down",
    reaction: "Margins crater; we're buying revenue at a loss.",
    reasoning:
      "A 50% cut puts us underwater on inference COGS per ticket and pushes break-even out by quarters. We'd be subsidising every new customer.",
    intensity: 92,
  },
  cto: {
    role: "cto",
    stance: "neutral",
    direction: "neutral",
    reaction: "No build change, but volume stresses the pipeline.",
    reasoning:
      "Pricing is a config change, so feasibility is unaffected — but 2-3x ticket volume means the clustering pipeline needs cost controls and rate limits sooner.",
    intensity: 40,
  },
  customer: {
    role: "customer",
    stance: "bullish",
    direction: "up",
    reaction: "Half price? I'd finally get budget sign-off.",
    reasoning:
      "At this price the tool clears my discretionary spend threshold, so I can adopt without a procurement fight. Adoption and satisfaction both jump.",
    intensity: 85,
  },
  competitor: {
    role: "competitor",
    stance: "bullish",
    direction: "up",
    reaction: "Thanks for starting a price war I can win.",
    reasoning:
      "As the better-capitalised incumbent, I can match your price and outlast you on burn. You've handed me a margin fight on my terms.",
    intensity: 80,
  },
};

export const SAMPLE_SANDBOX_IMPACT = {
  winners: ["Customer adoption", "Top-of-funnel growth", "Data moat velocity"],
  losers: ["Gross margin", "Runway", "Pricing power"],
  tradeoffs: [
    "Adoption surges but unit economics turn negative",
    "Faster land-grab now versus a deeper cash hole later",
  ],
  secondOrder: [
    "A price war the better-funded incumbent is positioned to win",
    "Cheaper price anchors the market low, making future increases painful",
  ],
  netDelta: -12,
  verdict:
    "Adoption spikes, but margins and defensibility erode — a growth bet that hands competitors a burn fight.",
};

export const SAMPLE_SANDBOX_RESULT: SandboxResult = {
  scenario: "Cut prices by 50%",
  reactions: Object.values(SAMPLE_SANDBOX_REACTIONS),
  ...SAMPLE_SANDBOX_IMPACT,
};
