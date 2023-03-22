import { Listbox, Transition } from '@headlessui/react'
import React from 'react'
import { twMerge } from 'tailwind-merge'

import { Icon } from '../Icon'
import {
	selectedIconWrapper,
	BaseSelectOption,
	CommonSelectProps,
} from './Select'

export type MultiSelectProps<T extends BaseSelectOption> = {
	multiSelectPlaceholder: string
	selected: T[]
	onChange: (value: T[]) => void
	options: T[]
} & CommonSelectProps

export const MultiSelect = <T extends BaseSelectOption>({
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
	multiSelectPlaceholder,
}: MultiSelectProps<T>): JSX.Element => {
	const display =
		selected && selected?.length > 0
			? `${multiSelectPlaceholder} (${selected.length})`
			: placeholder
	const multipleDisplay =
		selected?.length > 1
			? selected.map(({ display }) => display).join(', ')
			: ''
	return (
		<Listbox value={selected} onChange={onChange} name={name} multiple>
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
						<Listbox.Button className='relative w-full cursor-default rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm'>
							<span className='block truncate'>{display}</span>
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
								{options.map((option) => (
									<Listbox.Option
										key={option.value}
										className={({ active }) =>
											twMerge(
												active
													? 'bg-primary-600 text-white'
													: 'text-neutral-900',
												'relative cursor-default select-none py-2 pl-3 pr-9',
											)
										}
										value={option}
									>
										{({ selected, active }) => (
											<>
												{leftAddOn ? (
													<div className='flex items-center'>
														{option.leftAddOn}
														<span
															className={twMerge(
																selected ? 'font-semibold' : 'font-normal',
																'ml-3 block truncate',
															)}
														>
															{option.display}
														</span>
													</div>
												) : (
													<span
														className={twMerge(
															selected ? 'font-semibold' : 'font-normal',
															'block truncate',
														)}
													>
														{option.display}
													</span>
												)}

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
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
						<div className='pt-1 text-sm'>
							{selected.length > 0 && (
								<>
									{multiSelectPlaceholder}: {multipleDisplay}
								</>
							)}
						</div>
					</div>
				</>
			)}
		</Listbox>
	)
}
