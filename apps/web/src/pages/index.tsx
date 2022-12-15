import { trpc } from '@/utils/trpc'

const IndexPage = () => {
	const { data, error, isLoading } = trpc.uptime.uptime.useQuery()
	if (error) return <div>{JSON.stringify(error)}</div>
	if (isLoading) return <div>Loading...</div>

	return (
		<div>
			<h1>{data.uptime}</h1>
		</div>
	)
}

export default IndexPage
