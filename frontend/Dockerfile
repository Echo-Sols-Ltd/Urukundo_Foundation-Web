# Multistage Dockerfile for Next.js (App Router under src/app)
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Set environment variables for better network handling
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_FONT_GOOGLE_MUTED_WARNINGS=1
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --no-audit --no-fund --timeout=60000

# Copy rest of the app
COPY . .

# Build Next.js (standalone output) with extended timeout
RUN npm run build

# Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy build artifacts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ensure Next.js image cache directory exists and is writable at runtime
RUN mkdir -p /app/.next/cache && chown -R 1001:1001 /app/.next

USER 1001
EXPOSE 3000

# Start the standalone server
CMD ["node", "server.js"]
