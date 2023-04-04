import { cva } from 'cva'
import Link from 'next/link'

const stepLink = cva([], {
	variants: {
		status: {
			complete:
				'block h-2.5 w-2.5 rounded-full bg-primary-600 hover:bg-primary-900',
			current: 'relative flex items-center justify-center',
			upcoming: 'block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400',
		},
	},
})

type StepStatus = 'complete' | 'current' | 'upcoming'

export type Step =
	| { name: string; status: StepStatus; href: string }
	| {
			name: string
			onClick: () => void
			status: StepStatus
	  }

interface StepLinkProps {
	step: Step
}

const StepLink = ({ step }: StepLinkProps) => {
	if ('href' in step) {
		return (
			<Link
				href={step.href}
				className={stepLink({ status: step.status })}
				aria-current={step.status === 'current' ? 'step' : undefined}
			>
				{step.status === 'current' ? <CurrentStepIndicator /> : null}
				<span className='sr-only'>{step.name}</span>
			</Link>
		)
	} else if ('onClick' in step) {
		return (
			<button
				className={stepLink({ status: step.status })}
				onClick={step.onClick}
			>
				{step.status === 'current' ? <CurrentStepIndicator /> : null}
				<span className='sr-only'>{step.name}</span>
			</button>
		)
	} else {
		return null
	}
}

interface BulletStepsProps {
	steps: Step[]
}

export const BulletSteps = ({ steps }: BulletStepsProps) => {
	return (
		<nav className='flex items-center justify-center' aria-label='Progress'>
			<p className='text-sm font-medium'>
				Step {steps.findIndex((step) => step.status === 'current') + 1} of{' '}
				{steps.length}
			</p>
			<ol role='list' className='ml-8 flex items-center space-x-5'>
				{steps.map((step) => (
					<li key={step.name}>
						<StepLink step={step} />
					</li>
				))}
			</ol>
		</nav>
	)
}

const CurrentStepIndicator = () => (
	<>
		<span className='absolute flex h-5 w-5 p-px' aria-hidden='true'>
			<span className='h-full w-full rounded-full bg-indigo-200' />
		</span>
		<span
			className='relative block h-2.5 w-2.5 rounded-full bg-indigo-600'
			aria-hidden='true'
		/>
	</>
)
