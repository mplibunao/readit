import { ErrorLayout } from '@/components/Layout/Error'

export const Custom500 = (): JSX.Element => {
	return (
		<ErrorLayout
			code='500'
			title='Something went wrong'
			message='Oopps, something went wrong. Please try again later.'
			supportSubject='Error 500 Something went wrong'
		/>
	)
}

export default Custom500
