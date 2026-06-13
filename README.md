# Boardroom

An AI board meeting that analyzes your startup idea. Five agents — **VC, CFO, CTO, Customer, and Competitor** — debate the idea in real time and render rich **generative UI**: RiskCard, OpportunityCard, ScoreCard, CompetitorMap, MVPRoadmap, BoardMemo, and ActionPlan.

Built with **Next.js 15** (App Router) + **CopilotKit v1**, powered by **Gemini** via Vertex AI or AI Studio, with a swappable provider layer and a **credential-free mock** for instant local development.

Architecture is intentionally simple — **Frontend (CopilotKit) → Boardroom backend (Next.js API routes) → Gemini API** — with no hosted CopilotKit cloud service required.

### What's included

| # | Requirement | Where |
|---|---|---|
| 1 | Boardroom page | `src/app/page.tsx` → `src/components/Boardroom.tsx` |
| 2 | Five agents (VC, CFO, CTO, Customer, Competitor) | `src/lib/agents/personas.ts` |
| 3 | Backend API routes | `src/app/api/board/{analyze,synthesize}`, `api/upload`, `api/copilotkit`, `api/provider` |
| 4 | Gemini integration (reads `GEMINI_API_KEY` from env) | `src/lib/llm/gemini.ts` + `src/lib/llm/google.ts` |
| 5 | Structured JSON output | Zod schemas in `src/lib/types.ts`, validated in `google.ts` |
| 6 | Local run instructions | [Quick Start](#quick-start) below |
| 7 | Cloud Run deployment | [Deploy to Google Cloud Run](#deploy-to-google-cloud-run) + `Dockerfile` + `cloudbuild.yaml` |

---

## Quick Start

```bash
# Install dependencies (legacy flag required for Node 22)
npm install --legacy-peer-deps

# Start the dev server — works immediately in demo mode, no keys needed
npm run dev
```

Open <http://localhost:3000>, click **"use example"**, then **"Convene the board"** (and the weekend CTA) to see the full board meeting play out with mock data.

### Run live with Gemini (Google AI Studio)

```bash
cp .env.local.example .env.local
# edit .env.local and set:
#   LLM_PROVIDER=gemini
#   GEMINI_API_KEY=<your Google AI Studio key>   # https://aistudio.google.com/app/apikey
npm run dev
```

The header badge flips from **"Demo mode · mock"** to **"Live · gemini"** once a key is detected. Remove the key (or set `DEMO_MODE=true`) to fall back to the credential-free mock.

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values you need. **Never commit real keys** — `.env.local` is git-ignored. With **no credentials** the app runs in demo mode using the Mock provider.

| Variable | Description |
|---|---|
| `LLM_PROVIDER` | `"vertex"` \| `"gemini"` \| `"mock"` \| `"auto"` (default). `auto` picks the first provider that has credentials, falling back to mock. |
| `DEMO_MODE` | Set `true` to force the credential-free Mock provider even when a key is present. |
| `GEMINI_MODEL` | Model ID (default `gemini-2.5-flash`). |
| `GEMINI_API_KEY` | Google AI Studio API key ([get one here](https://aistudio.google.com/app/apikey)). Enables the `gemini` provider and powers CopilotKit chat. Read from the environment only — never committed. |
| `GOOGLE_CLOUD_PROJECT` | GCP project ID for Vertex AI. |
| `GOOGLE_CLOUD_LOCATION` | GCP region for Vertex AI (e.g. `us-central1`). |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to a service-account JSON (Vertex AI). On Cloud Run, use the service identity or Workload Identity instead. |

## Commands

```bash
npm run dev          # local dev at http://localhost:3000
npm run build        # production build (output: standalone)
npm run lint         # eslint
npx tsc --noEmit     # typecheck
```

---

## Deploy to Google Cloud Run

The project includes a multi-stage `Dockerfile` (Next.js standalone output) and a `cloudbuild.yaml` for Cloud Build.

### Prerequisites

- A GCP project with Cloud Run, Cloud Build, and Artifact Registry APIs enabled.
- An Artifact Registry Docker repository (e.g. `boardroom` in `us-central1`).
- `gcloud` CLI authenticated.

### Option A: Cloud Build (recommended)

```bash
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions=_REGION=us-central1,_SERVICE=boardroom,_REPO=boardroom
```

This builds the image, pushes it to Artifact Registry, and deploys to Cloud Run in one step.

### Option B: Manual build + deploy

```bash
# Build locally
docker build -t boardroom .

# Tag and push
docker tag boardroom us-central1-docker.pkg.dev/YOUR_PROJECT/boardroom/boardroom:latest
docker push us-central1-docker.pkg.dev/YOUR_PROJECT/boardroom/boardroom:latest

# Deploy
gcloud run deploy boardroom \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT/boardroom/boardroom:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
```

### Passing Model Credentials

With **no env vars** the service runs in demo/mock mode. To enable live AI:

#### AI Studio path (simplest)

```bash
gcloud run deploy boardroom \
  --update-env-vars LLM_PROVIDER=gemini,GEMINI_API_KEY=AIza...
```

Or store the key as a Cloud Run secret:

```bash
echo -n "AIza..." | gcloud secrets create gemini-api-key --data-file=-

gcloud run deploy boardroom \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest \
  --update-env-vars LLM_PROVIDER=gemini
```

#### Vertex AI path

Use the Cloud Run service account's identity (no key file needed):

```bash
gcloud run deploy boardroom \
  --update-env-vars LLM_PROVIDER=vertex,GOOGLE_CLOUD_PROJECT=my-project,GOOGLE_CLOUD_LOCATION=us-central1 \
  --service-account my-vertex-sa@my-project.iam.gserviceaccount.com
```

Or with Workload Identity Federation — attach the appropriate IAM bindings and set the env vars. No `GOOGLE_APPLICATION_CREDENTIALS` file is needed on Cloud Run.

---

## Architecture

```
src/
  lib/
    types.ts          # shared types + zod schemas (source of truth)
    sample.ts         # sample board output (mock + previews)
    utils.ts          # cn() class merge helper
    useBoard.ts       # client hook: streaming analyze + synthesize
    llm/              # provider abstraction (vertex | gemini | mock)
    agents/           # 5 personas + orchestrator
  components/
    board/            # 8 generative UI components + barrel
    Boardroom.tsx     # main canvas (idea input, roster, transcript, cards)
    BoardCopilot.tsx  # CopilotKit actions/readables
  app/
    api/board/analyze     # POST { idea } -> NDJSON stream
    api/board/synthesize  # POST { idea, analysis, question } -> BoardSynthesis
    api/copilotkit        # CopilotKit runtime
    api/upload            # POST PDF -> { text }
    api/provider          # GET -> active provider info
```

## License

MIT
