import { ErrorPageTemplate } from '@/components/Error'
import { MainLayout, Layout } from '@/components/Layout'

import { NextPageWithLayout } from './_app'

export const Custom500: NextPageWithLayout = (): JSX.Element => {
	return (
		<ErrorPageTemplate
			code='500'
			title='Something went wrong'
			message='Oopps, something went wrong. Please try again later.'
			supportSubject='Error 500 Something went wrong'
		/>
	)
}

Custom500.getLayout = (page) => (
	<Layout>
		<MainLayout bgClass='bg-white'>{page}</MainLayout>
	</Layout>
)

export default Custom500
