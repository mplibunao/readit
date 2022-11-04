ARG BASE_IMAGE=node:18.12.0-bullseye-slim
ARG DISTROLESS=gcr.io/distroless/nodejs:18
# docker run --entrypoint sh -it [IMAGE_NAME:TAG] to debug
ARG DISTROLESS_DEBUG=gcr.io/distroless/nodejs:debug

# Need a lightweight base image since pnpm isn't included by default
FROM $BASE_IMAGE AS base
RUN npm i -g pnpm && \
      export SHELL=$(which bash) && \
      SHELL=$SHELL pnpm setup

# Prune workspace
FROM base AS pruner
WORKDIR /app
COPY . .
RUN pnpm dlx turbo prune --scope=api --docker


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
# Build then use pnpm's own prune to generate node_modules with only prod deps
RUN pnpm build --filter=api && \
      pnpm --filter=api --prod deploy pruned


FROM $DISTROLESS AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=installer /app/apps/api/dist dist
COPY --from=installer /app/pruned/package.json ./
COPY --from=installer /app/pruned/node_modules node_modules
CMD ["apps/api/dist/index.js"]


