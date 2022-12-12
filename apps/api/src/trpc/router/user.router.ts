import {
	registerSchema,
	userByIdInput,
} from '@/modules/accounts/accounts.schema'
import { Accounts } from '@/modules/accounts/accounts.service'
import { publicProcedure, router } from '../trpc'

export const userRouter = router({
	register: publicProcedure
		.input(registerSchema)
		.query(async ({ ctx, input }) => {
			const userResult = await Accounts.create(ctx.pg, input)
			if (userResult.isErr()) throw userResult.error
			return userResult.value
		}),
	byId: publicProcedure.input(userByIdInput).query(async ({ ctx, input }) => {
		const userResult = await Accounts.findUserById(ctx.pg, input.id)
		if (userResult.isErr()) throw userResult.error
		return userResult.value
	}),
})
