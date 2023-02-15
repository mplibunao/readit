import { ErrorLayout } from '@/components/Layout/Error'
import { errorLayoutSchema } from '@api/utils/errors/handleRedirectErrors'
import { useRouter } from 'next/router'

export const ErrorPage = (): JSX.Element => {
	const router = useRouter()
	const props = router.query
	try {
		const errorProps = errorLayoutSchema.parse(props)
		return <ErrorLayout {...errorProps} />
	} catch (error) {
		return (
			<ErrorLayout
				code='400'
				title='Invalid error'
				message='You may be trying to visit this page manually'
			/>
		)
	}
}

export function getServerSideProps() {
	return {
		props: {},
	}
}

export default ErrorPage
