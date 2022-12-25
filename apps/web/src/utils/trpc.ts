import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from 'api'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { inferReactQueryProcedureOptions } from '@trpc/react-query'

export const trpc = createTRPCReact<AppRouter>()

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>
