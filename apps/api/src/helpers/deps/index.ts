import { PG } from '@api/infra/pg'
import { Logger } from '@readit/logger'

export const createDeps = (deps: { pg: PG; logger: Logger }) => {
	return deps
}

export type Deps = ReturnType<typeof createDeps>
