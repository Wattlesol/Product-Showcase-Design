# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer cache)
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ─── Stage 2: Production image ────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Non-root user for security
RUN addgroup -S lumina && adduser -S lumina -G lumina

# Only bring in production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built output from builder stage
COPY --from=builder /app/dist ./dist

# If you use a Google service account JSON file, copy it in
# (Only needed if you are NOT using the GOOGLE_SERVICE_ACCOUNT_JSON env var)
# COPY server/credentials.json ./server/credentials.json

USER lumina

ENV NODE_ENV=production
ENV PORT=3050

EXPOSE 3050

# Health check – hits the /api/health endpoint every 30s
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "dist/index.cjs"]
