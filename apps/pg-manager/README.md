## Commands

> **Note**: If running commands from root of workspace, you need to filter this packages using `--filter` or `-F`. Eg. `pnpm -F pg-manager db:gen:types`

- `db:gen:types`: Generates types and formats it               
- `db:migrate:dev`: Runs kysely migration
	- Syncs prisma schema with new state of database
	- Generates corresponding prisma migration
	- Marks it as applied so if want to generate migrations from prisma, you can
	- Caches for faster workflow
- `db:migrate:test`: Runs migration on test database
- `db:migrate:prod`: Runs migration through `dist/index.js`
	- **Note**: This only runs `kysely-migration-cli` but doesn't pass any specific arguments so you need to provide one
	- Eg. `--help`, `up`, `down`, `latest`, `redo` 
- `turbo run db:gen:types`: Runs when you run `pnpm dev` or `turbo run dev`
	- Runs `db:migrate:dev` 
	- Runs `db:gen:types`
- `db:migrate:reset`: Resets the database
- `db:gen:migration <name>`: Creates a new migration


### Separate migration commands per env

The reason we have 4 migration commands, 1 base and 1 for each environment is because:

1. For tests we need to pass the `NODE_ENV` since we check that (along with `process.env.CI`) to determine which `.env` files to load using dotenv or to ignore using dotenv altogether. This is needed so we pass a different database in `DATABASE_URL` and run migrations on the test database
2. For dev, we want a streamlined workflow that runs migration and generates types when we run the dev command, therefore we enabled caching using turborepo. However, caching database migrations are risky. Accidentally caching migrations can cause tests to fail or worse downtime if the remote caching kicks in. This is why we separated the dev command.
	- To demonstrate, you can run the following command to see turborepo caching on dev
	- **Note**: It's probably still possible to end up in a weird migration state (especially due to remote caching) but that's why I've added the `clean` command as an escape hatch
	
```sh
❯ turbo run dev --filter=api...
• Packages in scope: @readit/api, @readit/edge-config, @readit/eslint-config-server, @readit/pg, @readit/pg-manager, @readit/pino-logger, @readit/prettier-config, @readit/tsconfig
• Running dev in 8 packages
• Remote caching disabled
@readit/api:dev: cache bypass, force executing 94cc88defd82455c
@readit/pg-manager:db:migrate:dev: cache hit, replaying output b8283d72d7f12c69
@readit/pg-manager:db:migrate:dev:
@readit/pg-manager:db:migrate:dev: > @readit/pg-manager@0.0.0 db:migrate:dev /Users/mp/Projects/personal/temp/readit/apps/pg-manager
..
...
@readit/pg-manager:db:gen:types: cache hit, replaying output 1f764fd2bcd4dccf
@readit/pg-manager:db:gen:types:
@readit/pg-manager:db:gen:types: > @readit/pg-manager@0.0.0 db:gen:types /Users/mp/Projects/personal/temp/readit/apps/pg-manager
@readit/pg-manager:db:gen:types: > run-s kysely-codegen format:fix
```

3. Finally, the production command. Runs the transpiled js files instead of ts files. This allows us to remove typescript and other dependencies from the production image, making our final image much smaller and reducing storage costs

## What this package does

This package helps you manage your postgres database by providing you with the following functionality:

### Migrations

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

Migrations are handled using `kysely` and `kysely-migration-cli` as this is more flexible than prisma migrations and allow for data migrations, backfills, etc.

Although it's more verbose and involved compared to prisma migrations

### Prisma

I have tried to integrate prisma into migrations due to the declarative nature of prisma migrations and easy to use interface of prisma studio. However, I ended up giving up and ripping it due to errors experiencing when using kysely the backing sql executor for umzug

Also I've found prisma's generated sql to be unideal at times. Eg:
- Wrapping table names in "double-quotes" despite using lower case names in schema 
- `@default(uuid())` defaults to UUID v4. `@default(dbgenerated("gen_random_uuid()")) @db.Uuid` give a bit better performance
- Most of the stuff you want is probably achievable but it's tough because you have to learn another dsl on top of sql (atleast kysely is really close to sql)

If you are interested check out the following repos:
- [github marek hanzal prisma migration example](https://github.com/marek-hanzal/prisma-migration-example)
- [github marek hanzal puff smith](https://github.com/marek-hanzal/puff-smith)
- [github sequelize umzug](https://github.com/sequelize/umzug)
	- Migration tool
- [github leight core server blob main src source sql ts](https://github.com/leight-core/server/blob/main/src/source/sql.ts)
	- This is the helpers he's using to execute the raw sql files. I wrote my own implementation of this using kysely which may be why I was getting occassional errors


#### Alternatives

##### Run migrations on application startup

- This a common pattern for a lot of small applications, but I don't recommend it as it couples your migration to your application too much.
- Increases your cold start time if you are running on serverless which we are

##### Run migration on CI

- It's also common to run migrations on your CI like github actions
- This a better solution the previous one and this package supports that
- You just have to make sure to pass the correct `DATABASE_URL`
- One disadvantage I think this approach has is that you're managing you're secrets in too many places:
	- Application dashboard (setting it in vercel, heroku, etc)
	- CI (github actions)
	- Locally (break the glass situations, etc)
- Using something like [doppler](https://www.doppler.com/) probably solves this (probably better than my current approach)

##### Expose as http endpoints

- I've only seed this at one repo and it's feels weird and unsecure to expose it as http endpoints but I guess it's an option especially if you're behind a VPC or something
- I've mentioned this because it solves the secrets problem and because kysely is capable of doing this but not through [kysely-migration-cli](https://github.com/acro5piano/kysely-migration-cli) but rather by implementing your own [MigrationProvider](https://github.com/koskimas/kysely#migrations)


### Type generation

- Similar to migrations, type generation is also handled by `kysely` using [kysely codegen](https://github.com/RobinBlomberg/kysely-codegen) by default and generated in `db.d.ts`
- It's also the only thing being exported in this package just to be sure we don't increase the bundle size any more than we need to
- You can also use prisma's type generation if you prefer. You can check out [create-t3-turbo's](https://github.com/t3-oss/create-t3-turbo/tree/main/packages/db) implementation if you want

## Prisma studio

- Since we removed prisma, we can't use prisma studio anymore since it requires a prisma schema
- If you're interested in using a UI to visualize you're data, I would recommend checking out PG Admin or [tableplus](https://tableplus.com/pricing)
	- Table plus has a free tier with limited features and 2 databases I think
	- PG Admin is free. To use run the following command and restart your container

```sh
cp docker-compose.override.yml.example docker-compose.override.yml
```
