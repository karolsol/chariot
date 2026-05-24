FROM node:25.9.0-slim AS base
COPY . /app
RUN npm install -g corepack --force && corepack enable
WORKDIR /app

FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile \
     && cd apps/frontend && pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/apps/frontend/node_modules /app/apps/frontend/node_modules
RUN pnpm run build:all

FROM node:25.9.0-slim AS runner
WORKDIR /app

COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY --from=build --chown=node:node /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/apps/chariot/main.js"]
