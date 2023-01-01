import { trpc } from '@/utils/trpc'
import { DatabaseError } from '@readit/api/src/helpers/errors'

const IndexPage = () => {
	const { data, error, isLoading } = trpc.uptime.uptime.useQuery()
	if (error) {
		console.log('DatabaseError.prototype.type', DatabaseError.type) // eslint-disable-line no-console
		if (error.data?.type === DatabaseError.type) {
			console.log('woo')
		} else {
			console.log('no')
		}

		return <div>{JSON.stringify(error)}</div>
	}
	if (isLoading) return <div>Loading...</div>

	return (
		<div>
			<h1>{data.uptime}</h1>
		</div>
	)
}

export default IndexPage
