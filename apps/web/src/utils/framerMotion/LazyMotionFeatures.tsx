import { LazyMotion } from 'framer-motion'

const loadFeatures = () => import('./features').then((res) => res.default)

export const LazyMotionFeatures = ({
	children,
}: {
	children: React.ReactNode
}) => {
	return (
		<LazyMotion features={loadFeatures} strict>
			{children}
		</LazyMotion>
	)
}
