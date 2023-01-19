import { AppRouter } from '@readit/api'
import { createTRPCProxyClient } from '@trpc/client'

import { config } from './config'

export const api = createTRPCProxyClient<AppRouter>(config)
