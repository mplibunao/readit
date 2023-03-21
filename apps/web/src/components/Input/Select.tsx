import { Listbox, Transition } from '@headlessui/react'
import { cva } from 'cva'
import React from 'react'
import { twMerge } from 'tailwind-merge'

import { ConditionalWrapper } from '../ConditionalWrapper'
import { Icon } from '../Icon'

export const selectedIconWrapper = cva(
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

export type CommonSelectProps = {
	name?: string
	label: string
	labelClass?: string
	placeholder?: string
	// render element on the right or left of the selected option (eg. check icon)
	selectedOptionIcon?: React.ReactNode
	iconDirection?: 'left' | 'right'
	// render element on left of option and select input (eg. online indicator or avatar)
	leftAddOn?: boolean
	disabled?: boolean
}

export interface BaseSelectOption {
	display: string
	value: string
	leftAddOn?: React.ReactNode
}

export type SelectProps<T extends BaseSelectOption> = {
	selected: T | null
	onChange: (value: T | null) => void
	options: T[]
} & CommonSelectProps

export const Select = <T extends BaseSelectOption>({
	name,
	options,
	placeholder,
	selected,
	onChange,
	label,
	labelClass,
	selectedOptionIcon,
	iconDirection,
	leftAddOn,
	disabled,
}: SelectProps<T>): JSX.Element => {
	return (
		<Listbox
			value={selected}
			onChange={onChange}
			name={name}
			disabled={disabled}
		>
			{({ open }) => (
				<>
					<Listbox.Label
						className={twMerge(
							'block text-sm font-medium text-neutral-700',
							labelClass,
						)}
					>
						{label}
					</Listbox.Label>
					<div className='relative mt-1'>
						<Listbox.Button
							className={twMerge(
								'relative w-full cursor-default rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm',
								disabled
									? 'cursor-not-allowed opacity-60 border-neutral-200 bg-neutral-50 text-neutral-500'
									: '',
							)}
						>
							<ConditionalWrapper
								condition={!!leftAddOn}
								wrapper={(children) => (
									<span className='flex items-center'>
										{selected?.leftAddOn}
										{children}
									</span>
								)}
							>
								<span
									className={twMerge('block truncate', leftAddOn ? 'ml-3' : '')}
								>
									{selected ? selected.display : placeholder}
								</span>
							</ConditionalWrapper>

							<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
								<Icon
									className='h-5 w-5 text-neutral-400'
									id='chevron-up-down'
									hidden
								/>
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={React.Fragment}
							leave='transition ease-in duration-100'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
								{placeholder ? (
									<Listbox.Option
										key='placeholder'
										className={({ active }) =>
											twMerge(
												'relative cursor-default select-none py-2',
												active
													? 'bg-primary-600 text-white'
													: 'text-neutral-900',
												selectedOptionIcon && iconDirection === 'left'
													? 'pl-8 pr-4'
													: 'pl-3 pr-9',
											)
										}
										value={null}
									>
										{({ selected, active }) => {
											return (
												<>
													<span
														className={twMerge(
															selected ? 'font-semibold' : 'font-normal',
															leftAddOn ? 'ml-3' : '',
															'block truncate',
														)}
													>
														{placeholder}
													</span>

													{selected && selectedOptionIcon ? (
														<span
															className={twMerge(
																selectedIconWrapper({
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
									</Listbox.Option>
								) : null}

								{options.map((option) => (
									<Listbox.Option
										key={option.value}
										className={({ active }) =>
											twMerge(
												'relative cursor-default select-none py-2',
												active
													? 'bg-primary-600 text-white'
													: 'text-neutral-900',
												selectedOptionIcon && iconDirection === 'left'
													? 'pl-8 pr-4'
													: 'pl-3 pr-9',
											)
										}
										value={option}
									>
										{({ selected, active }) => {
											return (
												<>
													<ConditionalWrapper
														condition={!!leftAddOn}
														wrapper={(children) => (
															<div className='flex items-center'>
																{option.leftAddOn}
																{children}
															</div>
														)}
													>
														<span
															className={twMerge(
																selected ? 'font-semibold' : 'font-normal',
																leftAddOn ? 'ml-3' : '',
																'block truncate',
															)}
														>
															{option.display}
														</span>
													</ConditionalWrapper>

													{selected && selectedOptionIcon ? (
														<span
															className={twMerge(
																selectedIconWrapper({
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
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	)
}
