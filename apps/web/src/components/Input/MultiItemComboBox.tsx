import { Badge, getColor } from '@/components/Badge'
import { Combobox } from '@headlessui/react'
import React from 'react'
import { twMerge } from 'tailwind-merge'

import { Icon } from '../Icon'
import {
	ComboBoxCommonProps,
	Option,
	selectedItemIconWrapper,
} from './ComboBox'

type Selected = Option[]

export interface MultiItemComboBoxProps extends ComboBoxCommonProps {
	selected: Selected
	onChange: (selected: Option[]) => void
	maxSelected?: number
}

export const MultiItemComboBox = ({
	name,
	label,
	labelClass,
	options,
	selected,
	onChange,
	selectedOptionIcon,
	iconDirection,
	maxSelected,
}: MultiItemComboBoxProps): JSX.Element => {
	const [query, setQuery] = React.useState('')
	const [showFocus, setShowFocus] = React.useState(false)
	const inputRef = React.useRef<HTMLInputElement>(null)
	/*
	 * Input UI is just a div with input styles. Inside it is the:
	 * - list of badges (selected)
	 * - followed by the actual input (no borders)
	 * This makes the input hard to focus on, so when we click on the div, we focus on the input
	 */
	const handleFocusInput = () => {
		if (inputRef.current !== null) {
			inputRef.current.focus()
		}
	}

	const filteredOptions =
		query === ''
			? options
			: options.filter((option) => {
					return option.display.toLowerCase().includes(query.toLowerCase())
			  })
	/*
	 * - Only needed if you use the Controller component from react-hook-form
	 * - useController hook fixes the issue of toggling not working as expected
	 * - However, in order to apply max selected, we still need to determine if operation is select. If we just return upon hitting the max, user wouldn't be able to deselect
	 **/

	/*
	 *  const handleOnChange = (value: Selected) => {
	 *    const newValue = value.at(-1)
	 *    if (!newValue) return
	 *
	 *    const isDeselect = selected.find((item) => item.value === newValue.value)
	 *
	 *    if (isDeselect) {
	 *      handleDeselect(isDeselect.value)
	 *    } else {
	 *      // select
	 *      if (maxSelected && value.length > maxSelected) return
	 *      onChange(value)
	 *    }
	 *  }
	 */

	const handleDeselect = (value: Option['value']) => {
		onChange(selected.filter((item) => item.value !== value))
	}

	const handleOnChange = (value: Selected) => {
		if (maxSelected && value.length > maxSelected) return
		onChange(value)
	}

	return (
		<Combobox
			as='div'
			value={selected}
			onChange={handleOnChange}
			name={name}
			multiple
		>
			<div className='flex items-end justify-between'>
				<Combobox.Label
					className={twMerge(
						'block text-sm font-medium leading-6 text-neutral-900',
						labelClass,
					)}
				>
					{label}
				</Combobox.Label>
				<span className='text-xs'>
					{selected.length} / {maxSelected}
				</span>
			</div>
			<div className='relative mt-2'>
				<div
					className={twMerge(
						'w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 sm:text-sm sm:leading-6',
						showFocus ? 'ring-2 ring-inset ring-primary-600' : '',
					)}
					onClick={handleFocusInput}
				>
					{selected.map(({ display, value }) => (
						<button
							key={value}
							type='button'
							onClick={() => handleDeselect(value)}
						>
							<Badge
								key={value}
								size='sm'
								color={getColor(value)}
								rounded='rounded'
								className='pr-2 mr-2 mb-2'
								clickable
							>
								{display}{' '}
								<Icon hidden id='mini-x-mark' className='w-4 h-4 ml-1.5' />
							</Badge>
						</button>
					))}
					<Combobox.Input
						className='inline-block p-0 m-0 border-0 focus:ring-0 max-w-prose'
						onChange={(event) => setQuery(event.target.value)}
						ref={inputRef}
						onFocus={() => setShowFocus(true)}
						onBlur={() => setShowFocus(false)}
					/>
					<Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
						<Icon
							id='chevron-up-down'
							className='h-5 w-5 text-neutral-400'
							hidden
						/>
					</Combobox.Button>
				</div>

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
								{({ active, selected: isSelected }) => {
									return (
										<>
											{filteredOption.leftAddOn ? (
												<div className='flex items-center'>
													{filteredOption.leftAddOn}
													<span
														className={twMerge(
															isSelected ? 'font-semibold' : 'font-normal',
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
														isSelected && 'font-semibold',
													)}
												>
													{filteredOption.display}
												</span>
											)}

											{isSelected && selectedOptionIcon ? (
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
									)
								}}
							</Combobox.Option>
						))}
					</Combobox.Options>
				)}
			</div>
		</Combobox>
	)
}
