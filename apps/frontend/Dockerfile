FROM node:26-slim AS build
RUN npm install -g corepack && corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY libs/shared/package.json ./libs/shared/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter frontend...

COPY apps/frontend ./apps/frontend
COPY libs/shared ./libs/shared

RUN pnpm --filter frontend... build

FROM nginx:alpine AS runner
WORKDIR /app
COPY --from=build --chown=nginx:nginx /app/apps/frontend/dist /usr/share/nginx/html
