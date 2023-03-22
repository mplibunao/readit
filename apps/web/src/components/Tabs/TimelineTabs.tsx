import { tabs } from '@/constants/tabs'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

export const TimelineTabs = (): JSX.Element => {
	return (
		<div className='px-4 sm:px-0'>
			<div className='sm:hidden'>
				<label htmlFor='question-tabs' className='sr-only'>
					Select a tab
				</label>
				<select
					id='question-tabs'
					className='block w-full rounded-md border-neutral-300 text-base font-medium text-neutral-900 shadow-sm focus:border-primary-500 focus:ring-primary-500'
					defaultValue={'Recent'}
				>
					{tabs.map((tab) => (
						<option key={tab.name}>{tab.name}</option>
					))}
				</select>
			</div>
			<div className='hidden sm:block'>
				<nav
					className='isolate flex divide-x divide-gray-200 rounded-lg shadow'
					aria-label='Tabs'
				>
					{tabs.map((tab, tabIdx) => (
						<Link
							key={tab.name}
							href={tab.href}
							aria-current={tab.current ? 'page' : undefined}
							className={twMerge(
								tab.current
									? 'text-neutral-900'
									: 'text-neutral-500 hover:text-neutral-700',
								tabIdx === 0 ? 'rounded-l-lg' : '',
								tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
								'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-6 text-sm font-medium text-center hover:bg-neutral-50 focus:z-10',
							)}
						>
							<span>{tab.name}</span>
							<span
								aria-hidden='true'
								className={twMerge(
									tab.current ? 'bg-primary-500' : 'bg-transparent',
									'absolute inset-x-0 bottom-0 h-0.5',
								)}
							/>
						</Link>
					))}
				</nav>
			</div>
		</div>
	)
}
