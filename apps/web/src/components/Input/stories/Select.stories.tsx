import { Avatar } from '@/components/Avatar'
import { Icon } from '@/components/Icon'
import React from 'react'

import { MultiSelect } from '../MultiSelect'
import { Select } from '../Select'

type Option = {
	value: string
	display: string
	leftAddOn?: JSX.Element
}

const colorOptions = [
	{
		value: 'red',
		display: 'Red',
		leftAddOn: (
			<span
				className='bg-green-400 inline-block h-2 w-2 flex-shrink-0 rounded-full'
				aria-hidden='true'
			/>
		),
	},
	{
		value: 'blue',
		display: 'Blue',
		leftAddOn: (
			<span
				className='bg-gray-200 inline-block h-2 w-2 flex-shrink-0 rounded-full'
				aria-hidden='true'
			/>
		),
	},
	{
		value: 'yellow',
		display: 'Yellow',
		leftAddOn: (
			<span
				className='bg-gray-200 inline-block h-2 w-2 flex-shrink-0 rounded-full'
				aria-hidden='true'
			/>
		),
	},
	{
		value: 'green',
		display: 'Green',
		leftAddOn: (
			<span
				className='bg-gray-200 inline-block h-2 w-2 flex-shrink-0 rounded-full'
				aria-hidden='true'
			/>
		),
	},
	{
		value: 'orange',
		display: 'Orange',
		leftAddOn: (
			<span
				className='bg-green-400 inline-block h-2 w-2 flex-shrink-0 rounded-full'
				aria-hidden='true'
			/>
		),
	},
	{
		value: 'purple',
		display: 'Purple',
		leftAddOn: (
			<span
				className='bg-gray-200 inline-block h-2 w-2 flex-shrink-0 rounded-full'
				aria-hidden='true'
			/>
		),
	},
]

const peopleOptions = [
	{
		value: '1',
		display: 'Wade Cooper',
		leftAddOn: (
			<Avatar
				src='https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
				name='Wade Cooper'
				size='xs'
			/>
		),
	},
	{
		value: '2',
		display: 'Arlene Mccoy',
		leftAddOn: (
			<Avatar
				src='https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
				name='Arlene Mccoy'
				size='xs'
			/>
		),
	},
	{
		value: '3',
		display: 'Devon Webb',
		leftAddOn: (
			<Avatar
				src='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80'
				name='Devon Webb'
				size='xs'
			/>
		),
	},
	{
		value: '4',
		display: 'Tom Cook',
		leftAddOn: (
			<Avatar
				src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
				name='Tom Cook'
				size='xs'
			/>
		),
	},
	{
		value: '5',
		display: 'Tanya Fox',
		leftAddOn: (
			<Avatar
				src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
				name='Tanya Fox'
				size='xs'
			/>
		),
	},
	{
		value: '6',
		display: 'Hellen Schmidt',
		leftAddOn: (
			<Avatar
				src='https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
				name='Hellen Schmidt'
				size='xs'
			/>
		),
	},
	{
		value: '7',
		display: 'Caroline Schultz',
		leftAddOn: (
			<Avatar
				src='https://images.unsplash.com/photo-1568409938619-12e139227838?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
				name='Caroline Schultz'
				size='xs'
			/>
		),
	},
	{
		value: '8',
		display: 'Mason Heaney',
		leftAddOn: (
			<Avatar
				src='https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
				name='Mason Heaney'
				size='xs'
			/>
		),
	},
	{
		value: '9',
		display: 'Claudie Smitham',
		leftAddOn: (
			<Avatar
				src='https://images.unsplash.com/photo-1584486520270-19eca1efcce5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
				name='Claudie Smitham'
				size='xs'
			/>
		),
	},
	{
		value: '10',
		display: 'Emil Schaefer',
		leftAddOn: (
			<Avatar
				src='https://images.unsplash.com/photo-1561505457-3bcad021f8ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
				name='Emil Schaefer'
				size='xs'
			/>
		),
	},
]

export const Default = () => {
	const [value, setValue] = React.useState<Option | null>(null)
	return (
		<Select
			options={colorOptions}
			selected={value}
			onChange={(selected) => setValue(selected)}
			label='Color'
			name='color'
			placeholder='Select a color'
		/>
	)
}

export const Disabled = () => {
	const [value, setValue] = React.useState<Option | null>(null)
	return (
		<Select
			options={colorOptions}
			selected={value}
			onChange={(selected) => setValue(selected)}
			label='Color'
			name='color'
			placeholder='Select a color'
			disabled
		/>
	)
}

export const LabelHidden = () => {
	const [value, setValue] = React.useState<Option | null>(null)
	return (
		<Select
			options={colorOptions}
			selected={value}
			onChange={(selected) => setValue(selected)}
			label='Color'
			labelClass='sr-only'
			name='color'
			placeholder='Select a color'
		/>
	)
}

export const IconOnRightOption = () => {
	const [value, setValue] = React.useState<Option | null>(null)
	return (
		<Select
			options={colorOptions}
			selected={value}
			onChange={(selected) => setValue(selected)}
			label='Color'
			name='color'
			placeholder='Select a color'
			selectedOptionIcon={<Icon id='check' hidden className='h-5 w-5' />}
			iconDirection='right'
		/>
	)
}

export const IconOnLeftOption = () => {
	const [value, setValue] = React.useState<Option | null>(null)
	return (
		<Select
			options={colorOptions}
			selected={value}
			onChange={(selected) => setValue(selected)}
			label='Color'
			name='color'
			placeholder='Select a color'
			selectedOptionIcon={<Icon id='check' hidden className='h-5 w-5' />}
			iconDirection='left'
		/>
	)
}

export const LeftAddOnOnlineStatus = () => {
	const [value, setValue] = React.useState<Option | null>(null)
	return (
		<Select
			options={colorOptions}
			selected={value}
			onChange={(selected) => setValue(selected)}
			label='Color'
			name='color'
			placeholder='Select a color'
			leftAddOn
			selectedOptionIcon={<Icon id='check' hidden className='h-5 w-5' />}
			iconDirection='right'
		/>
	)
}

export const LeftAddOnAvatar = () => {
	const [value, setValue] = React.useState<Option | null>(null)
	return (
		<Select
			options={peopleOptions}
			selected={value}
			onChange={(selected) => setValue(selected)}
			label='Assigned to'
			name='assigned_to'
			placeholder='Assign to someone'
			leftAddOn
		/>
	)
}

export const MultipleSelection = () => {
	const [value, setValue] = React.useState<Option[]>([])
	return (
		<MultiSelect
			label='Assigned to'
			name='assigned_to'
			multiSelectPlaceholder='Assigned people'
			onChange={(selected) => setValue(selected)}
			options={peopleOptions}
			placeholder='Assign to one or more people'
			selected={value}
			leftAddOn
			selectedOptionIcon={<Icon id='check' hidden className='h-5 w-5' />}
			iconDirection='right'
		/>
	)
}

export const MultipleSelectionWrap = () => {
	const [value, setValue] = React.useState<Option[]>([])
	return (
		<div className='w-1/2'>
			<MultiSelect
				label='Assigned to'
				name='assigned_to'
				multiSelectPlaceholder='Assigned people'
				onChange={(selected) => setValue(selected)}
				options={peopleOptions}
				placeholder='Assign to one or more people'
				selected={value}
				leftAddOn
				selectedOptionIcon={<Icon id='check' hidden className='h-5 w-5' />}
				iconDirection='right'
			/>
		</div>
	)
}
