import {
	AccountEventsPublisher,
	buildAccountEventsPublisher,
} from '@api/modules/accounts/events/accountsEvents.publisher'
import {
	buildTokenMutationsRepo,
	TokenMutationsRepo,
} from '@api/modules/accounts/repositories/token.mutations.repo'
import {
	buildTokenQueriesRepo,
	TokenQueriesRepo,
} from '@api/modules/accounts/repositories/token.queries.repo'
import {
	buildUserMutationsRepo,
	UserMutationsRepo,
} from '@api/modules/accounts/repositories/user.mutations.repo'
import {
	buildUserQueriesRepo,
	UserQueriesRepo,
} from '@api/modules/accounts/repositories/user.queries.repo'
import {
	buildSessionService,
	SessionService,
} from '@api/modules/accounts/services/session.service'
import {
	buildUserService,
	UserService,
} from '@api/modules/accounts/services/user.service'
import { PubSub } from '@google-cloud/pubsub'
import { FlagsRepo, FlagsService } from '@readit/flags'
import { Logger } from '@readit/logger'
import { EdgeConfigClient } from '@vercel/edge-config'
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
import { buildEdgeConfig, buildFlagsRepo, buildFlagsService } from './flags'
import { buildMailerService, MailerService } from './mailer/MailerService'
import { EmailClient } from './mailer/postmarkClient'
import { registerEmailClient } from './mailer/registerEmailClient'
import { closePgClient, createPgClient, PG } from './pg/createClient'
import { buildPubSubService, PubSubService } from './pubsub/PubSubService'
import { buildPubSubClient } from './pubsub/client'
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
	session: Session
	edgeConfig: EdgeConfigClient
	FlagsRepo: FlagsRepo
	FlagsService: FlagsService
	pubsub: PubSub
	PubSubService: PubSubService
	AccountEventsPublisher: AccountEventsPublisher
	emailClient: EmailClient
	TokenMutationsRepo: TokenMutationsRepo
	TokenQueriesRepo: TokenQueriesRepo
	MailerService: MailerService
	UserQueriesRepo: UserQueriesRepo
	UserMutationsRepo: UserMutationsRepo
	UserService: UserService
	SessionService: SessionService
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
	interface Cradle extends Dependencies {}

	interface RequestCradle extends Dependencies {}
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
		edgeConfig: asFunction(buildEdgeConfig, SINGLETON_CONFIG),
		FlagsRepo: asFunction(buildFlagsRepo, SINGLETON_CONFIG),
		FlagsService: asFunction(buildFlagsService, SINGLETON_CONFIG),
		pubsub: asFunction(buildPubSubClient, SINGLETON_CONFIG),
		PubSubService: asFunction(buildPubSubService, SINGLETON_CONFIG),
		AccountEventsPublisher: asFunction(
			buildAccountEventsPublisher,
			SINGLETON_CONFIG,
		),
		emailClient: registerEmailClient(dependencies.config),
		TokenMutationsRepo: asFunction(buildTokenMutationsRepo, SINGLETON_CONFIG),
		TokenQueriesRepo: asFunction(buildTokenQueriesRepo, SINGLETON_CONFIG),
		MailerService: asFunction(buildMailerService, SINGLETON_CONFIG),
		UserQueriesRepo: asFunction(buildUserQueriesRepo, SINGLETON_CONFIG),
		UserMutationsRepo: asFunction(buildUserMutationsRepo, SINGLETON_CONFIG),
		SessionService: asFunction(buildSessionService, {
			lifetime: Lifetime.SCOPED,
		}),
		UserService: asFunction(buildUserService, { lifetime: Lifetime.SCOPED }),
	}

	diContainer.register(diConfig)

	for (const [dependencyKey, dependencyValue] of Object.entries(
		dependencyOverrides,
	)) {
		diContainer.register(dependencyKey, dependencyValue)
	}
}
