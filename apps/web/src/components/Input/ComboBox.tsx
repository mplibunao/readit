import { Combobox } from '@headlessui/react'
import { cva } from 'cva'
import React from 'react'
import { twMerge } from 'tailwind-merge'

import { Icon } from '../Icon'

export const selectedItemIconWrapper = cva(
	['absolute inset-y-0 flex items-center'],
	{
		variants: {
			direction: {
				left: 'left-0 pl-1.5',
				right: 'right-0 pr-4',
			},
			active: {
				true: 'text-white',
				false: 'text-primary-600',
			},
		},
		defaultVariants: {
			direction: 'left',
			active: false,
		},
	},
)

export type Option = {
	display: string
	value: string
	leftAddOn?: React.ReactNode
}

export interface ComboBoxCommonProps {
	name?: string
	label: string
	labelClass?: string
	iconDirection?: 'left' | 'right'
	options: Option[]
	selectedOptionIcon?: React.ReactNode
	disabled?: boolean
}

export type Selected = Option | null

export interface ComboBoxProps extends ComboBoxCommonProps {
	selected: Selected
	onChange: (selected: Selected) => void
}

export const ComboBox = ({
	name,
	label,
	labelClass,
	options,
	selected,
	onChange,
	selectedOptionIcon,
	iconDirection,
	disabled,
}: ComboBoxProps): JSX.Element => {
	const [query, setQuery] = React.useState('')

	const filteredOptions =
		query === ''
			? options
			: options.filter((option) => {
					return option.display.toLowerCase().includes(query.toLowerCase())
			  })

	return (
		<Combobox
			as='div'
			value={selected}
			onChange={onChange}
			name={name}
			disabled={disabled}
		>
			<Combobox.Label
				className={twMerge(
					'block text-sm font-medium leading-6 text-neutral-900',
					labelClass,
				)}
			>
				{label}
			</Combobox.Label>
			<div
				className={twMerge(
					'relative mt-2',
					disabled
						? 'cursor-not-allowed opacity-60 border-neutral-200 bg-neutral-50 text-neutral-500'
						: '',
				)}
			>
				<Combobox.Input
					className='w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6'
					onChange={(event) => setQuery(event.target.value)}
					displayValue={(selected: Selected) =>
						selected ? selected.display : ''
					}
				/>
				<Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
					<Icon
						id='chevron-up-down'
						className='h-5 w-5 text-neutral-400'
						hidden
					/>
				</Combobox.Button>

				{filteredOptions.length > 0 && (
					<Combobox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
						{filteredOptions.map((filteredOption) => (
							<Combobox.Option
								key={filteredOption.value}
								value={filteredOption}
								className={({ active }) =>
									twMerge(
										'relative cursor-default select-none py-2',
										active ? 'bg-primary-600 text-white' : 'text-neutral-900',
										selectedOptionIcon && iconDirection === 'left'
											? 'pl-8 pr-4'
											: 'pl-3 pr-9',
									)
								}
							>
								{({ active, selected }) => (
									<>
										{filteredOption.leftAddOn ? (
											<div className='flex items-center'>
												{filteredOption.leftAddOn}
												<span
													className={twMerge(
														selected ? 'font-semibold' : 'font-normal',
														'ml-3 block truncate',
													)}
												>
													{filteredOption.display}
												</span>
											</div>
										) : (
											<span
												className={twMerge(
													'block truncate',
													selected && 'font-semibold',
												)}
											>
												{filteredOption.display}
											</span>
										)}

										{selected && selectedOptionIcon ? (
											<span
												className={twMerge(
													selectedItemIconWrapper({
														active,
														direction: iconDirection,
													}),
												)}
											>
												{selectedOptionIcon}
											</span>
										) : null}
									</>
								)}
							</Combobox.Option>
						))}
					</Combobox.Options>
				)}
			</div>
		</Combobox>
	)
}
