import { protectedProcedure, publicProcedure, router } from '@api/trpc/builder'
import { handleTRPCServiceErrors } from '@api/utils/errors/handleTRPCServiceErrors'
import { z } from 'zod'

import { UserSchemas } from '../domain/user.schema'
import { UserDto } from '../dtos/user.dto'

export const userRouter = router({
	register: publicProcedure
		.input(UserSchemas.createUserInput)
		.output(UserSchemas.createUserOutput)
		.mutation(async ({ input, ctx: { deps, session } }) => {
			const { UserService, logger } = deps
			try {
				return await UserService.register({ input, session })
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	byId: publicProcedure
		.input(UserDto.findByIdInput)
		.output(UserSchemas.user)
		.query(async ({ input, ctx: { deps } }) => {
			const { UserService, logger } = deps
			try {
				return await UserService.findById(input.id)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	me: publicProcedure
		.output(z.union([UserSchemas.user, z.null()]))
		.query(async ({ ctx: { deps, session } }) => {
			const { UserService, logger } = deps
			try {
				const userSession = session.user
				if (!userSession) return null
				return await UserService.findById(userSession.id)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	login: publicProcedure
		.input(UserSchemas.loginInput)
		.output(z.void())
		.mutation(async ({ ctx: { deps }, input }) => {
			const { UserService, logger } = deps
			try {
				await UserService.login(input)
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
})
