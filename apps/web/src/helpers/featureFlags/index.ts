import { nextApi } from '@/utils/wretch'
import { useQuery } from '@tanstack/react-query'

export function useFeatureFlags<T>({
	flag,
	fallback,
}: {
	flag: string[]
	fallback: unknown[]
}) {
	return useQuery({
		queryKey: flag,
		queryFn: async () => {
			const flags = (await nextApi.url('/flags').post({ flag, fallback })) as T

			return flags
		},
	})
}
