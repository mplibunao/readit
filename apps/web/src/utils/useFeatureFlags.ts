import { useQuery } from '@tanstack/react-query'
import { nextApi } from './wretch'
import QueryStringAddon from 'wretch/addons/queryString'

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
			const flags = (await nextApi
				.addon(QueryStringAddon)
				.query({ flag, fallback })
				.get('/flags')) as T

			return flags
		},
	})
}
