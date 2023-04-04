import React from 'react'

import { BulletSteps, Step } from './BulletSteps'

const stepData: Step[] = [
	{ name: 'Step 1', onClick: () => {}, status: 'complete' },
	{ name: 'Step 2', onClick: () => {}, status: 'current' },
	{ name: 'Step 3', onClick: () => {}, status: 'upcoming' },
]

export const Default = () => {
	return <BulletSteps steps={stepData} />
}
