# ---- Base builder image ----
FROM node:20-slim AS builder

# Enable pnpm via corepack. The version comes from package.json "packageManager",
# so the image uses the same pnpm that generated pnpm-lock.yaml.
ENV COREPACK_ENABLE_STRICT=0
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

WORKDIR /app

# pnpm-workspace.yaml carries onlyBuiltDependencies; without it pnpm refuses the
# install with ERR_PNPM_IGNORED_BUILDS.
COPY package.json pnpm-lock.yaml .npmrc pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# Copy the rest of the app and build
COPY . .
RUN pnpm run build

# ---- Runtime image ----
FROM node:20-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

# Enable pnpm in runtime too
ENV COREPACK_ENABLE_STRICT=0
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# Same config files as the builder stage, so pnpm resolves identical settings
COPY package.json pnpm-lock.yaml .npmrc pnpm-workspace.yaml ./

# Install only production dependencies. --ignore-scripts skips the "prepare"
# hook, which shells out to svelte-kit (a devDependency absent from this stage).
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Copy built SvelteKit output from builder
COPY --from=builder /app/build ./build

# Default port inside container; Railway will override with its PORT env
ENV PORT=3000
EXPOSE 3000

# Start SvelteKit's adapter-node server. It will listen on process.env.PORT.
CMD ["node", "build"]
