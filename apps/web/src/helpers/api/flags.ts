import { nextBaseUrl } from '@/helpers/api/wretch'
import { useQuery } from '@tanstack/react-query'

export function useFlags<T>(params: { flags: string[]; fallback: unknown[] }) {
	return useQuery({
		queryKey: params.flags,
		queryFn: async () => {
			const flags = (await nextBaseUrl
				.url('/flags')
				.post({ flag: params.flags, fallback: params.fallback })) as T

			return flags
		},
	})
}
