import { ErrorPageTemplate } from '@/components/Error'
import { Layout, MainLayout } from '@/components/Layout'

import { NextPageWithLayout } from './_app'

export const Custom404: NextPageWithLayout = (): JSX.Element => {
	return (
		<ErrorPageTemplate
			code='404'
			title='Page not found'
			message='Sorry, we couldn’t find the page you’re looking for.'
			supportSubject='Error 404 Page not found'
		/>
	)
}

Custom404.getLayout = (page) => (
	<Layout>
		<MainLayout bgClass='bg-white'>{page}</MainLayout>
	</Layout>
)

export default Custom404
