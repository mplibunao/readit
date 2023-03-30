import { Dependencies } from '@api/infra/diConfig'
import { Session } from '@api/infra/session'
import {
	AppError,
	InternalServerError,
	UnauthorizedError,
} from '@api/utils/errors/baseError'
import { z } from 'zod'

import { UserSchemas } from '../domain/user.schema'
import { UserDto } from '../dtos/user.dto'

export type UserService = ReturnType<typeof buildUserService>

export const buildUserService = ({
	logger,
	TagService,
	UserRepository,
}: Dependencies) => {
	/*
	 *const generateUsername = (name: string, codeLength = 4) => {
	 *  const usernameSlug = slugify(`${name}`)
	 *  return `${usernameSlug}${generateCode(codeLength)}`
	 *}
	 */

	const findById = z
		.function()
		.args(UserSchemas.findByIdInput)
		.returns(z.promise(UserSchemas.user))
		.implement(async (id) => {
			try {
				return await UserRepository.findByIdOrThrow(id)
			} catch (error) {
				if (error instanceof AppError) {
					logger.error({ id, error }, `User was not found: ${error.type}`)
					throw error
				}
				logger.error({ id, error }, 'User was not found')
				throw new InternalServerError({ cause: error })
			}
		})

	const updateById = z
		.function()
		.args(UserSchemas.updateInput)
		.returns(z.promise(UserSchemas.user))
		.implement(async ({ id, user }) => {
			try {
				return await UserRepository.updateTakeOneOrThrow({
					where: { id },
					data: user,
				})
			} catch (error) {
				if (error instanceof AppError) {
					logger.error({ id, user, error }, `User update failed: ${error.type}`)
					throw error
				}
				logger.error({ id, user, error }, 'User update failed')
				throw new InternalServerError({ cause: error })
			}
		})

	const getStatus = (user: UserSchemas.User) => {
		if (user.deletedAt) return 'Deactivated'
		if (user.confirmedAt) return 'Active'
		return 'Unconfirmed'
	}

	const getAccountStatus = async ({
		session,
	}: {
		session: Session
	}): Promise<UserDto.AccountStatus> => {
		try {
			if (!session.user?.id) {
				throw new UnauthorizedError({
					message:
						"You are not authorized get another user's account status. Please login to fetch your own details",
				})
			}
			const { socialAccounts, hashedPassword, ...user } =
				await UserRepository.findAccountStatus(session.user.id)

			const accountStatus = {
				...user,
				hasPassword: !!hashedPassword,
				socialAccounts: socialAccounts,
				status: getStatus(user),
			}
			return UserDto.accountStatus.parse(accountStatus)
		} catch (error) {
			if (error instanceof AppError) {
				logger.error(
					{ error, userSession: session.user },
					`Account status fetch failed: ${error.type}`,
				)
				throw error
			}
			logger.error(
				{ error, userSession: session.user },
				'Account status fetch failed',
			)
			throw new InternalServerError({ cause: error })
		}
	}

	const upsertUserInterests = z
		.function()
		.args(UserSchemas.upsertUserInterestsInput, z.string().uuid())
		.implement(async ({ tagIds }, userId) => {
			try {
				return await TagService.upsertUserInterests({ tagIds, userId })
			} catch (error) {
				if (error instanceof AppError) {
					logger.error(
						{ error, userId, tagIds },
						`User interests upsert failed: ${error.type}`,
					)
					throw error
				}
				logger.error({ error, userId, tagIds }, 'User interests upsert failed')
				throw new InternalServerError({ cause: error })
			}
		})

	const getUserInterests = z
		.function()
		.args(z.string().uuid())
		.implement(async (userId) => {
			try {
				return await TagService.getUserInterests(userId)
			} catch (error) {
				if (error instanceof AppError) {
					logger.error(
						{ error, userId },
						`User interests fetch failed: ${error.type}`,
					)
					throw error
				}
				logger.error({ error, userId }, 'User interests fetch failed')
				throw new InternalServerError({ cause: error })
			}
		})

	return {
		findById,
		updateById,
		getAccountStatus,
		upsertUserInterests,
		getUserInterests,
	}
}
