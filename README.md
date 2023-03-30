[[toc]]

[![ci](https://github.com/mplibunao/readit/actions/workflows/ci.yml/badge.svg)](https://github.com/mplibunao/readit/actions/workflows/ci.yml) [![staging](https://github.com/mplibunao/readit/actions/workflows/staging.yml/badge.svg)](https://github.com/mplibunao/readit/actions/workflows/staging.yml) [![production](https://github.com/mplibunao/readit/actions/workflows/production.yml/badge.svg)](https://github.com/mplibunao/readit/actions/workflows/production.yml)


<p align="center">
  <img src="docs/readit-logo-120x120.png" />
</p>


# URLs

## Staging

- Web: readit.staging.mplibunao.tech
- API: readit-api-staging.mplibunao.tech
- Storybook/Ladle: readit.stories.staging.mplibunao.tech

## Production

- Web: readit.mplibunao.tech
- API: readit-api.mplibunao.tech
- Storybook/Ladle: readit.stories.mplibunao.tech


# Domains

- Accounts: User registration, login, profile management
- Communities: Community/Groups, Create, Manage
- Recommendations: Recommendation of content based on interests (posts and subreddits)

- Moderation/Admin: Owners and Moderators, Content moderation, NFSW flagging/blurring, lock thread, pin thread, user ban 
- Notifications: Realtime, Email
- Posts: Posts, Comments, Replies, upvotes, downvotes
- Search: Search posts, subreddits. 

# Documentation

- [Migrations](./apps/pg-manager/README.md)
- [Tunneling](./docs/tunnel.md)
- [CLI](./cli/README.md)
- [docs improvements](./docs/improvements.md)

# Reddit Clone v2

This is a more production-ready rewrite of [reddit clone](https://github.com/mplibunao/reddit-clone) based on the things that I've learned in the past year or so


# What's the difference?

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

### Turborepo

I switched to turborepo again after I managed solved my issues building docker images using turborepo.

I forgot the exact reasons I had for switching back to turborepo but I think it had something to do with performance, caching and turborepo's remote caching. In any case, it's hard to compare the build performance when I was wrote the piece on wireit to the build performance now because a lot of variables have changed like completely moving CI off docker (which reduced cache misses) as well as the project and number of internal packages growing in size. I'm still okay with using wireit today but if I don't encounter blockers like the ones I've encountered before when using turbo, pnpm and docker together then I would pick turborepo just for the remote cache alone.

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

At first I was using `docker-compose` to run my tests but decided to migrate it out of docker as well due to 2 reasons:

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

2. I was getting all cache-misses when running the CI on `docker-compose`. I don't recall exactly but I'm pretty sure moving off docker for the ci improved cache-hit rate for both wireit and turborepo. I was also able to utilize the github action cache for both monorepo tools which helped if there was really nothing that changed

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


## API


### Stack

- Fastify for backend framework
- TRPC for typesafe API
- Fastify Rest API Routes for Pubsub push endpoints, webhooks, etc
- Redis for cache and session store
- Neon Postgres for Database
- Awilix for dependency injection (using mostly functions) 
- Google Cloud Run for scale up and scale to 0 compute that supports concurrent requests
- Google Cloud Storage for object storage
- Google PubSub for dead letter queue
- Google Secret Manager for Secret Manager
- Terraform for Infrastructure as Code (Not included in this repo)
- Using `esbuild` instead of `tsc` for converting typescript code to javascript
- Using `vitest` instead of `jest` (Tried `tap` but appreciated how api compatible vitest is with jest and other testing tools)
- Email
  - React Email for email templates
  - Postmark for client (production)
  - `preview-email` for development
- edge-config for low latency feature flags on the edge

## Web

- NextJS
- TRPC for typesafe communication with the API
- Jest for tests
- Ladle for lightweight alternative to storybook
- Tailwind, tailwind-merge and cva for styling
- react-hook-form and zod for forms
- edge-config for low latency feature flags on the edge
- headlessui, radix-ui and ariakit for accessible headless components (should probably remove ariakit since we only use Button but it's pretty lightweight plus tree-shaking)
- jotai for state management

# Usage

## Develop

To develop all apps and packages, run the following commands

### Initialize .env files

```sh
pnpm cli init
```

### Start databases

Start the postgres and redis containers

```sh
./dc up
```

### Migrate the database, generate types and seed the database

```sh
./dc db:setup
```

### Start the dev servers

```sh
pnpm dev
```

## To run ci tests

```sh
./dc ci
```

## To clear the postgres database

```sh
# alias for docker-compose down -v
./dc destroy

# or destroy then start it back up again with no data
./dc db:reset
```

## To know more about the dc bash script and it's commands

```sh
./dc
```

## SVG Icons

The frontend uses an icon pipeline that generates an svg spritesheet for better performance

### Raw

To add new svg icons to the spritesheet, create an svg file in `src/icons/raw/`

Then run

```sh
pnpm -F web icons
```

This does the following:

- Optimize the icons in `raw` using `svgo` and puts the optimized svgs in `src/icons/processed`
- Creates the svg sprite and puts it in the `public` directory
- Updates the union types in `components/Icon/types`

### Usage

To use the Icon component, just pass the name of the svg file you used as the `id` prop

```tsx
return (
  <Icon id='eye-slash' />
)
```

### Notes

- This will help improve performance since the browser will only download the svg sprite once and then use it for all icons especially if you are rendering an icon multiple times like for example, a trash icon for every row
- Also rendering icons using jsx can a higher cost and can bloat the js bundle
- Try to keep the svg sprites below 125kb

The trade-off for this is you:
- You download the whole sprite even if you don't need everything. No tree shaking

### References

- [benadam thoughts react svg sprites](https://benadam.me/thoughts/react-svg-sprites/)
- [twitter _developit status](https://twitter.com/_developit/status/1382838799420514317)

## Email

Email uses cloud pubsub to send emails asynchronously and to allow retries in case of api errors

### Stand-alone Preview

To preview emails, run the following command:

```sh
pnpm -F emails dev
```

This will start react-email on `localhost:3001`

### Copying to api

Unfortunately, for some reason it's not possible to import the components in `packages/emails` to `api` as it causes errors

Therefore if you want to iterate on the components using the react-email server and copy it to api after you're done, you can run the ff command

```sh
pnpm -F emails copy
```

This will copy the components in `packages/emails` to `api`
