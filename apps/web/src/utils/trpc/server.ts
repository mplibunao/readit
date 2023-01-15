import { AppRouter } from '@api/trpc'
import { createTRPCProxyClient } from '@trpc/client'

import { config } from './config'

export const api = createTRPCProxyClient<AppRouter>(config)
