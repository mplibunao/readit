'use client'

import { clientTrpc, client } from '@/utils/trpc/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export function TrpcClientProvider({ children }: { children: ReactNode }) {
	const [queryClient] = useState(() => new QueryClient())
	const [trpcClient] = useState(() => clientTrpc)
	return (
		<client.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</client.Provider>
	)
}
