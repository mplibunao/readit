
# What this package does

This package helps you manage your postgres database by providing you with the following functionality:

## Migrations

One of the reasons why this is a separate package instead of part of the `@api` or `@pg` package is that I wanted to build this into a docker image and deploy it.

With the help of cloud run jobs I can trigger jobs using this container from the CI or locally without having to worry about secrets. Since I'm using GCP's secret manager for `DATABASE_URL`, this allows me to reuse it and still follow the principle of least privilege.

Another reason why this is a separate package is because of how `@api` is bundled.

1. `@api` is bundled with using `esbuild` with tree-shaking and a single entrypoint. This means that if it's not on the code path of `src/index.ts` then it's not included in the bundled js files. This is also the reason why file-based routing solutions like [@fastify/autoload](https://github.com/fastify/fastify-autoload) doesn't work well on `@api`
2. `@api` is using the [distroless](https://github.com/GoogleContainerTools/distroless) node image for it's docker container for a combination of:
	- Small bundle size: around 7MB smaller uncompressed
	- Compatibility: debian-based, uses glibc instead of musl libc, node alpine is marked as experimental
	- Support: Due to it being debian-based
	- Performance: I don't have exact proof for this but I've seen people say that perf is worse
		- [nickjanetakis blog benchmarking debian vs alpine as a base docker image](https://nickjanetakis.com/blog/benchmarking-debian-vs-alpine-as-a-base-docker-image)
		- [google search](https://www.google.com/search?q=alpine+images+are+slower&oq=alpine+images+are+slower&aqs=chrome..69i57j0i546l2.7616j0j4&sourceid=chrome&ie=UTF-8)

Unfortunately, this comes at cost of not having a shell.

> **Warning**: Whatever migration method you choose, I would advise you to stick to one to prevent issues as I think each migration methods stores migration data in different tables

### Kysely

By default, migrations are handled using `kysely` and `kysely-migration-cli` as this is more flexible than prisma migrations and allow for data migrations, backfills, etc.

Although it's more verbose and involved compared to prisma migrations

### Prisma

However, you are free to use prisma migrations if you prefer. This gives you a much easier migration experience where the prisma schema is the single source of truth and prisma generates the SQL needed to get your database to that state

Just make sure to swap out the dependencies and move `prisma` related deps into **dependencies** and `kysely` related deps into **dev-dependencies** as the docker build strips out the dev-dependencies to decrease final image size


### Alternatives

#### Run migrations on application startup

- This a common pattern for a lot of small applications, but I don't recommend it as it couples your migration to your application too much.
- Increases your cold start time if you are running on serverless which we are

#### Run migration on CI

- It's also common to run migrations on your CI like github actions
- This a better solution the previous one and this package supports that
- You just have to make sure to pass the correct `DATABASE_URL`
- One disadvantage I think this approach has is that you're managing you're secrets in too many places:
	- Application dashboard (setting it in vercel, heroku, etc)
	- CI (github actions)
	- Locally (break the glass situations, etc)
- Using something like [doppler](https://www.doppler.com/) probably solves this (probably better than my current approach)

#### Expose as http endpoints

- I've only seed this at one repo and it's feels weird and unsecure to expose it as http endpoints but I guess it's an option especially if you're behind a VPC or something
- I've mentioned this because it solves the secrets problem and because kysely is capable of doing this but not through [kysely-migration-cli](https://github.com/acro5piano/kysely-migration-cli) but rather by implementing your own [MigrationProvider](https://github.com/koskimas/kysely#migrations)


## Type generation

- Similar to migrations, type generation is also handled by `kysely` using [kysely codegen](https://github.com/RobinBlomberg/kysely-codegen) by default and generated in `db.d.ts`
- It's also the only thing being exported in this package just to be sure we don't increase the bundle size any more than we need to
- You can also use prisma's type generation if you prefer. You can check out [create-t3-turbo's](https://github.com/t3-oss/create-t3-turbo/tree/main/packages/db) implementation if you want

## Prisma studio

- You can also run prisma studio using this package if you want even if you are not using prisma for migrations and types. Turborepo runs `prisma db pull` to sync the prisma schema with the database so that we can run prisma studio for debugging purposes and better visualization of data while developing
