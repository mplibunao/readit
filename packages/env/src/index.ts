import dotenv from 'dotenv'

export const loadEnv = () => {
	const NODE_ENV = process.env.NODE_ENV || 'development'
	const CI = Boolean(process.env.CI)

	if (CI || NODE_ENV === 'production') return
	if (NODE_ENV === 'test') dotenv.config({ path: '.env.test' })
	if (NODE_ENV === 'development') dotenv.config()
}
