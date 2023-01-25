import {
	buildUserMutationsRepo,
	UserMutationsRepo,
} from '@api/modules/accounts/user/user.mutations.repo'
import {
	buildUserQueriesRepo,
	UserQueriesRepo,
} from '@api/modules/accounts/user/user.queries.repo'
import {
	buildUserService,
	UserService,
} from '@api/modules/accounts/user/user.service'
import { Logger } from '@readit/logger'
import {
	asFunction,
	asValue,
	AwilixContainer,
	Lifetime,
	Resolver,
} from 'awilix'
import { FastifyInstance } from 'fastify'
import Redis from 'ioredis'

import { Config } from './config'
import { closePgClient, createPgClient, PG } from './pg/createClient'
import { closeRedisClient, createRedisClient } from './redis/client'
import { Session } from './session'

export type ExternalDependencies = {
	config: Config
	app?: FastifyInstance
	logger: Logger
}

export const SINGLETON_CONFIG = { lifetime: Lifetime.SINGLETON }

export interface Dependencies {
	config: Config
	logger: Logger
	redis: Redis
	pg: PG
	session?: Session
	UserQueriesRepo: UserQueriesRepo
	UserMutationsRepo: UserMutationsRepo
	UserService: UserService
}

/*
 * Session is set on every request so it's not configured in diConfig
 * But allow passing it as override so we can mock it
 */
type DiConfig = Record<keyof Omit<Dependencies, 'session'>, Resolver<unknown>>
export type DependencyOverrides = Partial<
	Record<keyof Dependencies, Resolver<unknown>>
>

declare module '@fastify/awilix' {
	interface Cradle extends Dependencies {
		config: Config
		logger: Logger
		redis: Redis
		pg: PG
		//session: Session
	}

	interface RequestCradle extends Dependencies {
		config: Config
		logger: Logger
		redis: Redis
		pg: PG
		session: Session
	}
}

export function registerDependencies(
	diContainer: AwilixContainer,
	dependencies: ExternalDependencies,
	dependencyOverrides: DependencyOverrides = {},
): void {
	const diConfig: DiConfig = {
		config: asValue(dependencies.config),
		logger: asFunction(() => dependencies.logger, SINGLETON_CONFIG),
		redis: asFunction(createRedisClient, {
			dispose: closeRedisClient,
			lifetime: Lifetime.SINGLETON,
		}),
		pg: asFunction(createPgClient, {
			dispose: closePgClient,
			lifetime: Lifetime.SINGLETON,
		}),
		UserQueriesRepo: asFunction(buildUserQueriesRepo, SINGLETON_CONFIG),
		UserMutationsRepo: asFunction(buildUserMutationsRepo, SINGLETON_CONFIG),
		UserService: asFunction(buildUserService, { lifetime: 'SCOPED' }),
	}

	diContainer.register(diConfig)

	for (const [dependencyKey, dependencyValue] of Object.entries(
		dependencyOverrides,
	)) {
		diContainer.register(dependencyKey, dependencyValue)
	}
}
