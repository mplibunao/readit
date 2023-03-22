import { Badge } from '@/components/Badge'
import { Story } from '@ladle/react'

import { CheckboxGroup, CheckboxInput, CheckboxInputProps } from '../Checkbox'

export const Defalut: Story<CheckboxInputProps> = () => {
	return (
		<CheckboxGroup>
			<CheckboxInput label='Comments' name='comments' />
		</CheckboxGroup>
	)
}

export const WithDescription: Story<CheckboxInputProps> = () => {
	return (
		<CheckboxGroup>
			<CheckboxInput
				label='Comments'
				name='comments'
				description='Get notified when someone posts a comment on a posting.'
			/>
		</CheckboxGroup>
	)
}

export const MultipleDefault: Story<CheckboxInputProps> = () => {
	return (
		<CheckboxGroup>
			<div className='mt-4 space-y-4'>
				<CheckboxInput label='Comments' name='comments' />
				<CheckboxInput label='Candidates' name='candidates' />
			</div>
		</CheckboxGroup>
	)
}

export const MultipleWithDescription: Story<CheckboxInputProps> = () => {
	return (
		<CheckboxGroup>
			<div className='mt-4 space-y-4'>
				<CheckboxInput
					label='Comments'
					name='comments'
					description='Get notified when someone posts a comment on a posting.'
				/>
				<CheckboxInput
					label='Candidates'
					name='candidates'
					description='Get notified when a candidate applies for a job'
				/>
			</div>
		</CheckboxGroup>
	)
}

export const WithVisibleLegend: Story<CheckboxInputProps> = () => {
	return (
		<CheckboxGroup label='Email'>
			<div className='mt-4 space-y-4'>
				<CheckboxInput
					label='Comments'
					name='comments'
					description='Get notified when someone posts a comment on a posting.'
				/>
				<CheckboxInput
					label='Candidates'
					name='candidates'
					description='Get notified when a candidate applies for a job'
				/>
			</div>
		</CheckboxGroup>
	)
}

export const WithBadge: Story<CheckboxInputProps> = () => {
	return (
		<CheckboxGroup label='Adult content'>
			<CheckboxInput label='18+ year old community' name='isNsfw'>
				<Badge color='error' rounded='rounded' className='mr-2'>
					NSFW
				</Badge>
			</CheckboxInput>
		</CheckboxGroup>
	)
}
