import { UserDto } from '@api/modules/accounts/domain/user.dto'
import { publicProcedure, router } from '@api/trpc/builder'
import { handleTRPCServiceErrors } from '@api/utils/errors/handleTRPCServiceErrors'
import { until } from '@open-draft/until'
import { z } from 'zod'

import { FindByIdError } from '../domain/user.errors'
import { User } from '../domain/user.types'

export const userRouter = router({
	register: publicProcedure
		.input(UserDto.registerInput)
		.output(UserDto.registerOutput)
		.mutation(async ({ input, ctx: { UserService, logger } }) => {
			try {
				return UserService.register(input)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),
	byId: publicProcedure
		.input(UserDto.userByIdInput)
		.output(UserDto.userByIdOutput)
		.query(async ({ input, ctx: { UserService, logger } }) => {
			try {
				return UserService.findById(input.id)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	me: publicProcedure
		.output(z.union([UserDto.userByIdOutput, z.null()]))
		.query(async ({ ctx: { SessionService, UserService, logger } }) => {
			const { data, error } = await until<
				FindByIdError,
				User.UserSchema | null
			>(async () => {
				const userSession = SessionService.getUser()
				if (!userSession) return null
				return UserService.findById(userSession.id)
			})

			if (error) throw handleTRPCServiceErrors(error, logger)

			return data
		}),
})
