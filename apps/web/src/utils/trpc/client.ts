import type { AppRouter } from '@readit/api'
import { createTRPCReact } from '@trpc/react-query'

import { config } from './config'

export const client = createTRPCReact<AppRouter>()

export const clientTrpc = client.createClient(config)
