import { nextFetch } from '@/utils/request'
import { nextBaseUrl } from '@/utils/url'
import { useQuery } from '@tanstack/react-query'

export function useFlags<T>(params: { flags: string[]; fallback: unknown[] }) {
	return useQuery({
		queryKey: params.flags,
		queryFn: async () => {
			const url = new URL('/api/flags', nextBaseUrl)
			return nextFetch<T>(url.toString(), {
				method: 'POST',
				body: JSON.stringify({ flag: params.flags, fallback: params.fallback }),
			})
		},
	})
}
