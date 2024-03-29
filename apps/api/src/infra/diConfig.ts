import {
	AccountEventsPublisher,
	buildAccountEventsPublisher,
} from '@api/modules/accounts/events/accountsEvents.publisher'
import { SocialAccountRepository } from '@api/modules/accounts/repositories/socialAccount.repository'
import { TokenRepository } from '@api/modules/accounts/repositories/token.repository'
import { UserRepository } from '@api/modules/accounts/repositories/user.repository'
import {
	AuthService,
	buildAuthService,
} from '@api/modules/accounts/services/auth.service'
import {
	buildOAuthService,
	OAuthServiceType,
} from '@api/modules/accounts/services/oauth.service'
import {
	buildTokenService,
	TokenService,
} from '@api/modules/accounts/services/token.service'
import {
	buildUserService,
	UserService,
} from '@api/modules/accounts/services/user.service'
import { CommunityRepository } from '@api/modules/communities/repositories/community.repository'
import {
	CommunityService,
	buildCommunityService,
} from '@api/modules/communities/services/community.service'
import { TagRepository } from '@api/modules/recommendations/repositories/tag.repository'
import {
	RecommendationService,
	buildRecommendationService,
} from '@api/modules/recommendations/services/recommendation.service'
import { TagService } from '@api/modules/recommendations/services/tag.service'
import { PubSub } from '@google-cloud/pubsub'
import { FlagsRepo, FlagsService } from '@readit/flags'
import { Logger } from '@readit/logger'
import { EdgeConfigClient } from '@vercel/edge-config'
import {
	asClass,
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
import { EmailClient } from './mailer/client/postmarkClient'
import { registerEmailClient } from './mailer/registerEmailClient'
import { closePgClient, createPgClient, PG } from './pg/createClient'
import { buildPubSubService, PubSubService } from './pubsub/PubSubService'
import { buildPubSubClient } from './pubsub/client'
import { closeRedisClient, createRedisClient } from './redis'

export type ExternalDependencies = {
	config: Config
	app?: FastifyInstance
	logger: Logger
}

/*
 * Reverts to default lifetime for tests since services depending on services that are passed as overrides still call the old registered service instead of the overrides resulting in hard to track down bugs
 * Eg. When testing AuthService, services are register as usual, but when you pass a mock for pubsubClient, the override is registered after all the default registration (SINGLETON)
 * Therefore when AuthService calls pubsubClient, it calls the default one instead of the mock passed as override
 * This issue can happen in other envs as well but it only matters in tests since that is the only place where we pass overrides (for mocking)
 */
const getSingletonConfig = () =>
	process.env.NODE_ENV === 'test'
		? { lifetime: Lifetime.TRANSIENT }
		: { lifetime: Lifetime.SINGLETON }

export const SINGLETON_CONFIG = getSingletonConfig()

export interface Dependencies {
	config: Config
	logger: Logger
	redis: Redis
	pg: PG
	edgeConfig: EdgeConfigClient
	FlagsRepo: FlagsRepo
	FlagsService: FlagsService
	pubsub: PubSub
	PubSubService: PubSubService
	AccountEventsPublisher: AccountEventsPublisher
	emailClient: EmailClient
	TokenRepository: TokenRepository
	TokenService: TokenService
	MailerService: MailerService
	UserRepository: UserRepository
	SocialAccountRepository: SocialAccountRepository
	OAuthService: OAuthServiceType
	AuthService: AuthService
	UserService: UserService
	TagRepository: TagRepository
	TagService: TagService
	CommunityRepository: CommunityRepository
	CommunityService: CommunityService
	RecommendationService: RecommendationService
}

/*
 * Session is set on every request so it's not configured in diConfig
 * But allow passing it as override so we can mock it
 */
type DiConfig = Record<keyof Dependencies, Resolver<unknown>>
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
		TokenRepository: asClass(TokenRepository, SINGLETON_CONFIG),
		TokenService: asFunction(buildTokenService, SINGLETON_CONFIG),
		MailerService: asFunction(buildMailerService, SINGLETON_CONFIG),
		UserRepository: asClass(UserRepository, SINGLETON_CONFIG),
		SocialAccountRepository: asClass(SocialAccountRepository, SINGLETON_CONFIG),
		OAuthService: asFunction(buildOAuthService, SINGLETON_CONFIG),
		AuthService: asFunction(buildAuthService, SINGLETON_CONFIG),
		UserService: asFunction(buildUserService, SINGLETON_CONFIG),
		TagRepository: asClass(TagRepository, SINGLETON_CONFIG),
		TagService: asClass(TagService, SINGLETON_CONFIG),
		CommunityRepository: asClass(CommunityRepository, SINGLETON_CONFIG),
		CommunityService: asFunction(buildCommunityService, SINGLETON_CONFIG),
		RecommendationService: asFunction(
			buildRecommendationService,
			SINGLETON_CONFIG,
		),
	}

	diContainer.register(diConfig)

	for (const [dependencyKey, dependencyValue] of Object.entries(
		dependencyOverrides,
	)) {
		diContainer.register(dependencyKey, dependencyValue)
	}
}
