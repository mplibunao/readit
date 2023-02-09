import { publicProcedure, router } from '@api/trpc/builder'
import { handleTRPCServiceErrors } from '@api/utils/errors/handleTRPCServiceErrors'
import { z } from 'zod'

import { UserSchemas } from '../domain/user.schema'
import { UserDto } from '../dtos/user.dto'

export const userRouter = router({
	register: publicProcedure
		.input(UserSchemas.createUserInput)
		.output(UserSchemas.createUserOutput)
		.mutation(async ({ input, ctx: { UserService, logger } }) => {
			try {
				return await UserService.register(input)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	byId: publicProcedure
		.input(UserDto.findByIdInput)
		.output(UserSchemas.user)
		.query(async ({ input, ctx: { UserService, logger } }) => {
			try {
				return await UserService.findById(input.id)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	me: publicProcedure
		.output(z.union([UserSchemas.user, z.null()]))
		.query(async ({ ctx: { SessionService, UserService, logger } }) => {
			try {
				const userSession = SessionService.getUser()
				if (!userSession) return null
				return await UserService.findById(userSession.id)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	login: publicProcedure
		.input(UserSchemas.loginInput)
		.output(z.void())
		.mutation(async ({ ctx: { UserService, logger }, input }) => {
			try {
				await UserService.login(input)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),
})
