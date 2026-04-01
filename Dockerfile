FROM node:25.8.2-slim AS base
COPY . /app
RUN npm install -g corepack --force && corepack enable
WORKDIR /app

FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
RUN pnpm run build:all

FROM node:25.8.2-slim AS runner
WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/apps/chariot/main.js"]
