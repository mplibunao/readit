import { publicProcedure, router } from '@api/trpc/builder'
import { handleTRPCServiceErrors } from '@api/utils/errors/handleTRPCServiceErrors'
import { until } from '@open-draft/until'
import { z } from 'zod'

import { FindByIdError } from '../domain/user.errors'
import { UserSchemas } from '../domain/user.schema'
import { UserDto } from '../dtos/user.dto'

export const userRouter = router({
	register: publicProcedure
		.input(UserSchemas.createUserInput)
		.output(UserSchemas.createUserOutput)
		.mutation(async ({ input, ctx: { UserService, logger } }) => {
			try {
				return UserService.register(input)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	byId: publicProcedure
		.input(UserDto.findByIdInput)
		.output(UserSchemas.user)
		.query(async ({ input, ctx: { UserService, logger } }) => {
			try {
				return UserService.findById(input.id)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	me: publicProcedure
		.output(z.union([UserSchemas.user, z.null()]))
		.query(async ({ ctx: { SessionService, UserService, logger } }) => {
			const { data, error } = await until<
				FindByIdError,
				UserSchemas.User | null
			>(async () => {
				const userSession = SessionService.getUser()
				if (!userSession) return null
				return UserService.findById(userSession.id)
			})

			if (error) throw handleTRPCServiceErrors(error, logger)

			return data
		}),

	//login: publicProcedure.input(UserSchemas.).output(UserSchemas.user).mutation(async () => {

	//})
})
