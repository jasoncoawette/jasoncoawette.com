# ---- Base builder image ----
FROM node:20-slim AS builder

# Enable pnpm via corepack
ENV COREPACK_ENABLE_STRICT=0
RUN corepack enable

WORKDIR /app

# Install dependencies (cached as long as package.json / lockfile don't change)
COPY package.json pnpm-lock.yaml ./
# If you have .npmrc or pnpm-workspace.yaml, add them too:
# COPY .npmrc pnpm-workspace.yaml ./

RUN pnpm install

# Copy the rest of the app and build
COPY . .
RUN pnpm run build

# ---- Runtime image ----
FROM node:20-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

# Enable pnpm in runtime too
ENV COREPACK_ENABLE_STRICT=0
RUN corepack enable

# Copy package.json and lockfile for prod install
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod

# Copy built SvelteKit output from builder
COPY --from=builder /app/build ./build

# Default port inside container; Railway will override with its PORT env
ENV PORT=3000
EXPOSE 3000

# Start SvelteKit's adapter-node server. It will listen on process.env.PORT.
CMD ["node", "build"]
