import { ErrorPageTemplate } from '@/components/Error'
import { Layout, MainLayout } from '@/components/Layout'
import { LoadingPage } from '@/components/Spinner'
import { errorLayoutSchema } from '@api/utils/errors/handleRedirectErrors'
import { useRouter } from 'next/router'

import { NextPageWithLayout } from './_app'

export const ErrorPage: NextPageWithLayout = (): JSX.Element => {
	const router = useRouter()
	if (!router.isReady) {
		return <LoadingPage />
	}
	const props = router.query
	try {
		const errorProps = errorLayoutSchema.parse(props)
		return <ErrorPageTemplate {...errorProps} />
	} catch (error) {
		return (
			<ErrorPageTemplate
				code='400'
				title='Invalid error'
				message='You may be trying to visit this page manually'
			/>
		)
	}
}

ErrorPage.getLayout = (page) => (
	<Layout>
		<MainLayout bgClass='bg-white'>{page}</MainLayout>
	</Layout>
)

export default ErrorPage
