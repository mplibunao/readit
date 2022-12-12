[[toc]]

[![ci](https://github.com/mplibunao/readit/actions/workflows/ci.yml/badge.svg)](https://github.com/mplibunao/readit/actions/workflows/ci.yml) [![staging](https://github.com/mplibunao/readit/actions/workflows/staging.yml/badge.svg)](https://github.com/mplibunao/readit/actions/workflows/staging.yml) [![production](https://github.com/mplibunao/readit/actions/workflows/production.yml/badge.svg)](https://github.com/mplibunao/readit/actions/workflows/production.yml)


# Domains

- Accounts: Users
- Moderation: Owners and Moderators
- Subreddit: Community/Groups

# Reddit Clone v2

This is a more production-ready rewrite of [reddit clone](https://github.com/mplibunao/reddit-clone) based on the things that I've learned in the past year or so

# What's the difference?

## Performance

### API

I've tried to consider performance in a lot of my decisions in this project like:

- Switching the http and graphql server to mercurius due to it's high throughput (still not as fast as compiled languages like go, rust, crystal, etc but it's one of the few that gets close in node land)
- Using raw sql for better query performance, [postgres.js](https://github.com/porsager/postgres) in particular
- Reducing cold starts _as much as possible within reason_ due to me dabbling into cloud run which is basically serverless containers.
  - _Within reason_ because I believe this approach is more of a hybrid of serverless and traditional long-running servers therefore both throughput and cold starts are important metrics and should be measured (priority would depend on the whether you plan to move to long-running services in the future as well as the stage of the product)
  - Achieved by:
    - Being bundle size conscious when choosing dependencies
    - Lazy loading dependencies
    - Bundling and minifying code using esbuild

#### References

- ORMs performance
  - [github edgedb imdbench](https://github.com/edgedb/imdbench)
  - [github porsager postgres benchmarks](https://github.com/porsager/postgres-benchmarks)
  - [porsager github imdbench sql](https://porsager.github.io/imdbench/sql.html)
  - [github gajus slonik tree master benchmark](https://github.com/gajus/slonik/tree/master/benchmark)
  - [github jamescmartinez rust vs node postgres bench](https://github.com/jamescmartinez/rust-vs-node-postgres-bench)

## Developer experience

Mostly this refers to faster installs, builds, and other operations. The speed gains for a project this size is most likely negligible but starts to become noticeable for bigger projects and for developer machines that aren't as powerful. Some of the notable improvements include:

### Monorepo

One key difference from v1 is the use of workspaces instead of just being a monorepo of isolated applications. This has been a double-edged sword so far.

On the bright side, it allows sharing of tooling and code like eslint configs, tsconfig, UI components, validation schemas, etc, faster installs for shared dependencies across multiple workspaces

One the other hand, there are some trade-offs like the increased complexity in using with docker especially when you want to keep your images as small as possible.

### pnpm

This tool definitely deserves it's own section. I haven't tried yarn v2 yet but compared to npm and yarn v1, pnpm just blows the competition out of the water.

- Faster installs and smaller disk usage on your dev machine
- Smart and almost automatic management/resolution of the lock file. I don't think I've ever needed to resolve conflicts in the lock file, just run `pnpm i` and it fixes itself
- `pnpm fetch` which really improves install speeds on containers especially monorepos
- `pnpm deploy` for producing small docker images for monorepos which is particularly challenging

### Wireit

During the early days, I first tried turborepo but decided to switch when I've managed to pin the problems I've had building the docker image to following turborepo's example using docker using it's own version of `pnpm deploy` called `turbo prune`. I think I've managed to get it working using yarn but really wanted to gain the speed benefits of pnpm

So I switched to [Google's wireit](https://github.com/google/wireit) which admittedly seems less mature but has certain advantages like using the same package manager commands I already know (`npm`/`yarn`/`pnpm`). Note that it might be possible to get turborepo working (in-case you really want the remote caching) with pnpm and docker if you stick to `pnpm deploy` but I didn't want to waste anymore time or headspace thinking about that particular problem

In any case, both tools offer similar advantages, which is:

- Mainly caching outputs for builds, test, lints
- Orchestrating/chaining commands
- Adding things like watch capabilities.

So far one thing, I didn't like about wireit was I all the cache-miss I was getting when running the CI using docker. I've managed to get the cache-hits when running the CI using docker on my dev machine so it's possibly due to the ephemeral nature of the CI runner. You can cache wireit on github actions using a plugin but I don't think you can do that inside a container.

### Docker

I used to be die-hard docker fan and believed in running dev as close to prod but this project has caused me to change my stance in containerization.

#### Dev

I still think it's useful but I decided to drop running dev using containers due to following reasons:

- Slow installs, not able to utilize cache (much more noticeable on `pnpm`)
- No terminal colors
- No auto-complete (fig, etc)
- No aliases
- Difficult to cache docker layers on monorepos
- Composing different commands is a pain
  - Makefiles are a nice workaround for this but I've found overtime you end up with a really big makefile due to the number of possible permutation of commands. Also wasn't as satisfied with it's ability to take complex args (I forgot the exact issue but I think it was something about more complex flags)
  - Wrapper bash scripts are better for me since they allow you to compose commands better and can take args/flags better but I've found writing complex bash scripts isn't really as fun
- You can't really switch around between dockerized and non-dockerized envs as you can get a lot of possible issues like permission problems especially if you're not running as root inside the container which is best practice or dependency errors if you're host OS is different from your container OS (some packages install different things for mac and linux so if you install using mac, you better run it on mac)
- Bind mounts have bad performance on mac due to docker using virtualization and syncing between host and container filesystem (It's been greatly improved in the new versions but I doubt it's now the same speed as running natively like on linux)

Example

To install express on a dockerized dev env vs installing it outside docker

```sh
# Dockerized
## Runs api service which runs pnpm filtering the api workspace to add express
docker-compose run --rm api pnpm -F api add -D express
## Using aliased wrapper scripts is better but now you have to read and learn how to use the `dc` script too alongside pnpm workspaces and docker-compose
dc run api pnpm -F api add -D express

# Non-dockerized
## I'm able to use aliases
p -F api add -D express
```

> **Note**: I still like to run other services on dev that don't require bind mounts using docker like postgres, redis, etc. But anything that whose code I need to edit and rebuild consistently, I'd prefer not running those on docker anymore

#### CI

Currently, I'm still using `docker-compose` to run my tests. But I'm kinda partial to migrating it out of docker as well due to 2 reasons:

1. It's hard to cache docker layers with a monorepo

To illustrate, here's an example dockerfile for the `api` app that uses multi-stage builds.

The `VIRTUAL_STORE_IMAGE` is a base image that runs `pnpm fetch` to download all the deps across all workspaces into the pnpm store. This is used by all workspaces that need to run `pnpm install` to make the install fast (usually around 2-3 seconds)

The problem is that the **`COPY . .` stanza in `ci` copies the whole monorepo from the root to other apps and packages**. Therefore, when a change in a different workspace occurs but not in `api`, the `COPY . .` still results in a cache miss and has to copy the whole repo again and install all the deps in the succeeding stanzas. Thankfully, due the virtual store, it only takes a few seconds for each install step. But as you can see it's not very optimized, although you can probably optimize it by only copying the specific app directory (`apps/api`), all the packages it depends on (`packages/eslint-config-custom-server`), probably some of the files in the root workspace, it feels like an anti-pattern since you have to really know the details and dependencies of each workspace just to improve speed by a few seconds

```dockerfile
# Dockerfile.base

FROM base AS virtual-store
ENV NODE_ENV=development
WORKDIR /app
COPY pnpm-lock.yaml .
RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store/v3 pnpm fetch


# apps/api/Dockerfile
ARG VIRTUAL_STORE_IMAGE=ghcr.io/mplibunao/reddit-virtual-store:latest

FROM $VIRTUAL_STORE_IMAGE AS ci
WORKDIR /app
COPY . .
RUN pnpm i -wF api --prefer-offline --frozen-lockfile
RUN pnpm i -F eslint-config-custom-server --prefer-offline --frozen-lockfile
CMD ["pnpm", "-F", "api", "check"]
```

2. As mentioned in the wireit section, I was getting all cache-misses when running the CI on `docker-compose`. I'm not sure if it's because of my wireit configuration, or if it will result in a cache-hit if I move out of `docker-compose` but I have a feeling that if I atlease utilize github action's cache, it should result in some cache-hits if there really is nothing that changed

#### Production

So far, for production I still prefer to use docker as it gives me versatility to deploy in different platforms, services each with it's own performance, scalability, and pricing characteristics

It also allows for quick rollbacks when using container registries

One thing I've changed is using [distroless images](https://github.com/GoogleContainerTools/distroless) instead of alpine for my final images. If you're already doing multi-stage builds, I would recommend you check out distroless images as you probably don't have to change much in your current builds

The advantages of distroless over alpine:

- Smaller image (I've noticed around 7 MB difference when **uncompressed**)
- Better compatibility since distroless is debian based although for node, I don't think I've noticed much issues with alpine (still it is experimental)
- Better support (since it's debian-based)
- Better performance (I don't have exact proof for this but I've seen people say that perf is worse)

Disadvantages:

- No shell. Although they have a version of the image with a shell which is 1 MB bigger if you need it for debugging purposes (`gcr.io/distroless/nodejs:debug`)
  - To debug run `docker run --entrypoint sh -it <image_name>`

##### References

- [nickjanetakis blog benchmarking debian vs alpine as a base docker image](https://nickjanetakis.com/blog/benchmarking-debian-vs-alpine-as-a-base-docker-image)
- [distroless images](https://github.com/GoogleContainerTools/distroless)
- [github GoogleContainerTools distroless tree main examples nodejs](https://github.com/GoogleContainerTools/distroless/tree/main/examples/nodejs)
- [github GoogleContainerTools distroless blob main nodejs README](https://github.com/GoogleContainerTools/distroless/blob/main/nodejs/README.md)

#### Rough CI Benchmarks (API)

##### Running tests

Running tests in a non-docker env really improves the speed by a lot especially with cache-hits

|     | Docker   | Non-docker           |
| --- | -------- | -------------------- |
| API | 45s-1:16 | 23s                  |
|     |          | 20s                  |
|     |          | 13s (full cache hit) |
|     |          | 11s (full cache hit) |

##### API CI

For a full CI pipeline, non-dockerized is closer to the dockerized env pipeline but still much faster

|       | Docker | Non-docker             |
| ----- | ------ | ---------------------- |
| Speed | 1:44s  | 1:47s                  |
|       | 1:49s  | 1:27s                  |
|       | 1:34s  | 1:16s (full cache hit) |
|       | 1:32s  | 1:02s (skip base pnpm) |
|       | 1:57s  |                        |
|       | 1:30s  |                        |
|       | 1:36s  |                        |
|       | 1:57s  |                        |
|       | 1:51s  |                        |

#### Rough CICD Benchmarks (API)

> **Note**: Lots of changes happened with CICD pipeline. So numbers may not be exact

- Fully dockerized numbers seem to be better (not by much) although those numbers are much older
- Billable time for hybrid of docker and non-docker seemed higher although in the latest runs, I've managed to make it clock at around 4m so more or less the same with full docker.
- One thing to note is that github actions bills a minimum of 1 min per job even though the job only runs for a few seconds so some optimization might be possible there

##### Docker CI & build

- 2:57s
  - 51s CI
  - 1:17s build/push
  - 5m billable time
- 2:26s
  - 45s CI
  - 50s Build/push
  - 4m billable time
- 2:14s
  - 44s CI
  - 43s build/push
  - 4m billable time

##### Non-docker CI & docker build

- 3:51s
  - 25s CI (cache miss tests)
  - 48s base_pnpm (cache miss)
  - 1m 1s Build/push
  - 6m billable time
- 2:43s
  - 14s CI
  - 36s base_pnpm (I think `/commands` always cause a cache miss because it references main or something)
  - 51s build/push
  - 5m billable time
- 2:38s
  - 19s CI
  - 30s base image
  - 51s build/push
  - 4m billable time

### API

- Using `esbuild` instead of `tsc` for converting typescript code to javascript
- Using `vitest` instead of `jest` (Tried `tap` but appreciated how api compatible vitest is with jest and other testing tools)

# What's inside?

This repo includes the following packages/apps:

## Apps and Packages

- `docs`: a [Next.js](https://nextjs.org) app
- `web`: another [Next.js](https://nextjs.org) app
- `api`: A fastify graphql API
- `ui`: a stub React component library shared by both `web` and `docs` applications
- `eslint-config-custom`: `eslint` configurations
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

# Usage

## Develop

To develop all apps and packages, run the following command:

```sh
pnpm dev
```

## Turborepo

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
pnpm dlx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your turborepo:

```
pnpm dlx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Pipelines](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
