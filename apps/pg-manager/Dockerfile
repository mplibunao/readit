ARG BASE_IMAGE=node:18.12.1-bullseye-slim
ARG PRODUCTION_IMAGE=node:18.12.1-bullseye-slim
#ARG PRODUCTION_IMAGE=node:18.12.1-alpine

FROM $BASE_IMAGE AS base
RUN npm i -g pnpm && \
      export SHELL=$(which bash) && \
      SHELL=$SHELL pnpm setup

# Prune workspace
FROM base AS pruner
WORKDIR /app
COPY . .
RUN pnpm dlx turbo prune --scope=@readit/pg-manager --docker


FROM base AS installer
WORKDIR /app
# Install dependencies since they change less often
COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --prefer-offline
# Build the project
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm dlx turbo run build --filter=@readit/pg-manager
RUN pnpm --filter=@readit/pg-manager --prod deploy pruned


FROM $PRODUCTION_IMAGE AS production
WORKDIR /app
ENV NODE_ENV=production
#COPY --from=installer /app/pruned/esbuild-register-loader.mjs ./
#COPY --from=installer /app/pruned/tsconfig.json ./
COPY --from=installer /app/apps/pg-manager/dist dist 
COPY --from=installer /app/pruned/package.json ./
COPY --from=installer /app/pruned/node_modules node_modules
CMD ["node", "dist/index.js", "latest"]
