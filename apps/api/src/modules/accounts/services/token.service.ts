import { Dependencies } from '@api/infra/diConfig'
import { AppError, InternalServerError } from '@api/utils/errors/baseError'
import { randomUUID } from 'crypto'
import { z } from 'zod'

import { TokenNotFound } from '../domain/token.errors'
import { TokenSchemas } from '../domain/token.schema'

export type TokenService = ReturnType<typeof buildTokenService>

export const buildTokenService = ({
	TokenRepository,
	logger,
}: Dependencies) => {
	const create = z
		.function()
		.args(TokenSchemas.createTokenInput)
		.returns(z.promise(TokenSchemas.token))
		.implement(async ({ expirationTimeInSeconds, ...params }) => {
			try {
				const token = {
					id: randomUUID(),
					...params,
				}
				await TokenRepository.set(token.id, token, expirationTimeInSeconds)
				return token
			} catch (error) {
				logger.error(
					{ error, params, expirationTimeInSeconds },
					'Failed to create token',
				)
				throw new InternalServerError({
					cause: error,
					message: 'Something went wrong while trying to creating token',
				})
			}
		})

	const get = async (id: string): Promise<TokenSchemas.Token> => {
		try {
			const token = await TokenRepository.get(id)
			if (!token) throw new TokenNotFound({})
			return token
		} catch (error) {
			if (error instanceof AppError) {
				logger.error({ error, id }, `Failed to get token: ${error.type}`)
				throw error
			}
			logger.error({ error, id }, 'Failed to get token')
			throw new InternalServerError({
				cause: error,
				message: 'Something went wrong while trying to get token',
			})
		}
	}

	const del = async (id: string): Promise<true> => {
		try {
			const result = await TokenRepository.del(id)
			if (!result) {
				throw new TokenNotFound({
					message:
						'Something went wrong while verifying the email link. Please request a new one',
				})
			}
			return result
		} catch (error) {
			if (error instanceof AppError) {
				logger.error({ error, id }, `Failed to delete token: ${error.type}`)
				throw error
			}
			logger.error({ error, id }, 'Failed to delete token')
			throw new InternalServerError({
				cause: error,
				message: 'Something went wrong while trying to delete token',
			})
		}
	}

	return {
		create,
		get,
		del,
	}
}
