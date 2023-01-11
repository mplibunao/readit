import { FastifyInstance } from 'fastify'

export const clearDatabase = async (fastify: FastifyInstance) => {
	await fastify.pg.deleteFrom('users').execute()
}
