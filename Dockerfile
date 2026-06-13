# ── Stage 1: install dependencies ────────────────────────────────────────────
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ── Stage 2: build the Next.js standalone bundle ────────────────────────────
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── Stage 3: production runtime ─────────────────────────────────────────────
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Static assets and the standalone server
COPY --from=builder /app/public             ./public
COPY --from=builder /app/.next/static       ./.next/static
COPY --from=builder /app/.next/standalone   ./

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
