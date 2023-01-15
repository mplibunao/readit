import { api } from '@/utils/trpc/server'

export interface SSRProps {
	hello: number
}

export default function SSR(props: SSRProps): JSX.Element {
	return <div>SSR: {props.hello}</div>
}

export async function getServerSideProps() {
	const uptime = await api.uptime.uptime.query()

	return {
		props: {
			hello: uptime.uptime,
		},
	}
}
