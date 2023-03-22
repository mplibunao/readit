import { protectedProcedure, publicProcedure, router } from '@api/trpc/builder'
import { UnauthorizedError } from '@api/utils/errors/baseError'
import { handleTRPCServiceErrors } from '@api/utils/errors/handleTRPCServiceErrors'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { OAuthSchemas } from '../domain/oAuth.schema'
import { UserSchemas } from '../domain/user.schema'

export const authRouter = router({
	register: publicProcedure
		.input(UserSchemas.createUserInput)
		.mutation(async ({ input, ctx: { deps, session } }) => {
			const { AuthService, logger } = deps
			try {
				return await AuthService.register({ input, session })
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	resendConfirmationEmail: protectedProcedure
		.output(z.promise(z.literal('ok')))
		.mutation(async ({ ctx: { deps, session } }) => {
			const { AccountEventsPublisher, logger } = deps
			try {
				if (!session.user?.id) {
					throw new UnauthorizedError({})
				}
				await AccountEventsPublisher.registerUser({ userId: session.user.id })
				return 'ok'
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	createOAuthUser: publicProcedure
		.input(OAuthSchemas.createOAuthUserInput)
		.output(OAuthSchemas.createOAuthUserOutput)
		.mutation(async ({ input, ctx: { deps, session } }) => {
			const { OAuthService, logger } = deps
			try {
				const result = await OAuthService.createUserFromSocial(input)
				session.user = { id: result.user.id }
				session.partialUser = undefined
				return result
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	getPartialOAuthUser: publicProcedure
		.output(OAuthSchemas.getPartialOAuthUserOutput)
		.query(
			async ({
				ctx: {
					deps: { logger },
					session,
				},
			}) => {
				try {
					if (session.partialUser) {
						return session.partialUser
					}
					throw new TRPCError({
						code: 'NOT_FOUND',
						message:
							'Social user data not found. Please try again or contact support.',
					})
				} catch (error) {
					throw handleTRPCServiceErrors(error, logger)
				}
			},
		),

	login: publicProcedure
		.input(UserSchemas.loginInput)
		.output(z.void())
		.mutation(async ({ ctx: { deps }, input }) => {
			const { AuthService, logger } = deps
			try {
				await AuthService.login(input)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	logout: protectedProcedure
		.output(z.boolean())
		.mutation(async ({ ctx: { deps, session } }) => {
			const { logger, config } = deps
			try {
				await session.destroy()
				return true
			} catch (error) {
				logger.error(
					{
						error,
						cookieName: config.session.cookieName,
						session,
					},
					'Error logging out',
				)
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	unlinkSocialAccount: protectedProcedure
		.input(z.string())
		.output(z.promise(OAuthSchemas.provider))
		.mutation(async ({ ctx: { deps, session }, input }) => {
			const { OAuthService, logger } = deps
			try {
				const provider = await OAuthService.unlinkSocialAccount({
					session,
					id: input,
				})
				return provider as OAuthSchemas.Provider
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	changePassword: protectedProcedure
		.input(UserSchemas.changePasswordInput)
		.mutation(async ({ ctx, input }) => {
			const { AuthService, logger } = ctx.deps
			try {
				await AuthService.changePassword(input)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	requestChangeEmail: protectedProcedure
		.input(UserSchemas.requestChangeEmailInput)
		.mutation(async ({ ctx, input }) => {
			const { AuthService, logger } = ctx.deps
			try {
				return await AuthService.requestChangeEmail(input)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	forgotPassword: publicProcedure
		.input(UserSchemas.forgotPasswordInput)
		.mutation(async ({ ctx, input }) => {
			const { AuthService, logger } = ctx.deps
			try {
				return await AuthService.forgotPassword(input)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	resetPassword: publicProcedure
		.input(UserSchemas.resetPasswordInput)
		.mutation(async ({ ctx, input }) => {
			const { AuthService, logger } = ctx.deps
			try {
				return await AuthService.resetPassword(input, ctx.session)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),
})
