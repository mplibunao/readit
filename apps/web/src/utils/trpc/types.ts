import type { AppRouter } from '@readit/api'
import type { inferReactQueryProcedureOptions } from '@trpc/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>
