import { protectedProcedure, publicProcedure, router } from '@api/trpc/builder'
import { handleTRPCServiceErrors } from '@api/utils/errors/handleTRPCServiceErrors'
import { z } from 'zod'

import { UserSchemas } from '../domain/user.schema'
import { UserDto } from '../dtos/user.dto'

export const userRouter = router({
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

	updateProfile: protectedProcedure
		.input(UserDto.updateProfileInput)
		.output(UserSchemas.user)
		.mutation(async ({ input, ctx }) => {
			const {
				deps: { UserService, logger },
			} = ctx
			const { id, ...user } = input
			try {
				return await UserService.updateById({ id, user })
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	getStatus: protectedProcedure.query(async ({ ctx }) => {
		const {
			session,
			deps: { UserService, logger },
		} = ctx

		try {
			return await UserService.getAccountStatus({ session })
		} catch (error) {
			throw handleTRPCServiceErrors(error, logger)
		}
	}),

	upsertUserInterests: protectedProcedure
		.input(UserSchemas.upsertUserInterestsInput)
		.mutation(async ({ ctx, input }) => {
			const { session, deps } = ctx
			const { logger, UserService } = deps
			try {
				return await UserService.upsertUserInterests(input, session.user!.id)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	getInterests: protectedProcedure.query(async ({ ctx }) => {
		const { session, deps } = ctx
		const { logger, UserService } = deps
		try {
			return await UserService.getUserInterests(session.user!.id)
		} catch (error) {
			throw handleTRPCServiceErrors(error, logger)
		}
	}),
})
