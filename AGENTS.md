# Boardroom — agent guide

Boardroom is a hackathon MVP: paste a startup idea (or upload a deck PDF) and a
five-agent AI board (VC, CFO, CTO, Customer, Competitor) debates it and renders
**generative UI** — risk cards, opportunity cards, a score radar, a competitor
map, an MVP roadmap, and finally a board memo + weekend action plan.

## Stack (do not change versions)

- Next.js **15.5.4**, App Router, React **18.3**, TypeScript, Tailwind CSS **v4**.
- CopilotKit **v1.60** (`@copilotkit/react-core`, `@copilotkit/react-ui`,
  `@copilotkit/runtime`) — the generative UI / chat layer.
- `@google/genai` for Gemini (Vertex AI **and** AI Studio).
- `recharts`, `framer-motion`, `lucide-react`, `react-dropzone`, `unpdf`, `zod` (v3).

This is **standard, stable Next.js 15** — normal App Router conventions apply.

## Architecture

```
src/
  lib/
    types.ts          # ⭐ SOURCE OF TRUTH: all shared types + zod schemas + enums
    sample.ts         # realistic sample board output (used by mock + previews)
    utils.ts          # cn() class merge helper
    useBoard.ts       # client hook: streaming analyze + synthesize state
    llm/              # provider abstraction (vertex | gemini | mock | factory)
    agents/           # 5 personas + orchestrator (runBoardAnalysis/Synthesis)
  components/
    board/            # the 8 generative UI components (one file each) + barrel
    Boardroom.tsx     # main canvas (idea input, roster, transcript, cards)
    BoardCopilot.tsx  # registers CopilotKit actions/readables
  app/
    api/board/analyze     # POST { idea } -> NDJSON stream of BoardStreamEvent
    api/board/synthesize  # POST { idea, analysis, question } -> BoardSynthesis
    api/copilotkit        # CopilotKit runtime (Gemini chat adapter or empty)
    api/upload            # POST PDF -> { text }
    api/provider          # GET -> active provider name + live flag
```

## Rules for contributors (including sub-agents)

1. **`src/lib/types.ts` is the contract.** Import types from `@/lib/types`. Do
   not change a *published* shape or a component's prop signature without
   coordinating — other files depend on it.
2. **Do NOT edit `package.json` or `package-lock.json`.** All dependencies are
   pre-installed. If you genuinely need a new one, call it out in your PR
   description instead of editing the lockfile (avoids merge conflicts).
3. **Own only your assigned files.** Work is parallelized across disjoint files
   to keep merges clean.
4. The app must keep running in **demo mode with zero credentials** (Mock
   provider). Never make a code path crash when no API key is set.

## Commands

```bash
npm run dev          # local dev at http://localhost:3000
npm run build        # production build (output: standalone)
npm run lint         # eslint
npx tsc --noEmit     # typecheck
```

No API keys are required to run — the Mock provider serves canned board output.
