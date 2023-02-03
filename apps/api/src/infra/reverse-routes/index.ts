import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import pathToRegexp, { PathFunction } from 'path-to-regexp'

type Routes = Map<string, PathFunction<object>>
type Reverse = <Args>(name: string, args?: Args) => string

declare module 'fastify' {
	interface FastifyInstance {
		reverse: Reverse
		routes: Routes
	}

	interface RouteOptions {
		name: string
	}
}

export const routes: Routes = new Map()

export const reverse: Reverse = (name, args) => {
	const toPath = routes.get(name)

	if (!toPath) {
		throw new Error(`Route with name ${name} is not registered`)
	}

	return toPath(args as object)
}

const plugin: FastifyPluginAsync = async (fastify) => {
	const name = 'reverse'
	const routesName = 'routes'

	try {
		if (fastify[name]) {
			throw new Error(`plugin '${name}' instance has already been registered`)
		}

		if (fastify[routesName]) {
			throw new Error(
				`plugin '${routesName}' instance has already been registered`,
			)
		}

		fastify.decorate(name, reverse).addHook('onRoute', (routeOptions) => {
			if (routeOptions.name) {
				// Fastify exposes a duplicate HEAD route for GET routes which cause collisions
				if (['HEAD', 'OPTIONS'].includes(routeOptions.method as string)) return
				if (routes.has(routeOptions.name)) {
					throw new Error(
						`Route with name ${routeOptions.name} already registered`,
					)
				}

				routes.set(routeOptions.name, pathToRegexp.compile(routeOptions.url))
			}
		})

		fastify.decorate(routesName, routes)
	} catch (err) {
		const error = `Error initializing reverse routes plugin: ${err}`
		fastify.log.error(error)
		throw new Error(error)
	}
}

export default fp(plugin, { name: 'reverse' })
