import Link from 'next/link'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'

import { Icon } from '../Icon'
import { Select } from '../Input'

export interface SettingsLayoutProps {
	children: React.ReactNode
}

type Tab = { display: string; value: string }

const tabs: Tab[] = [
	{ display: 'Account', value: '/settings' },
	{ display: 'Profile', value: '/settings/profile' },
	{ display: 'Feed Settings', value: '/settings/feed' },
]

export const SettingsLayout = ({
	children,
}: SettingsLayoutProps): JSX.Element => {
	const router = useRouter()
	const { pathname } = router

	const isTabActive = (tab: Tab): boolean => {
		return tab.value === pathname
	}

	const handleChangeTab = (value: Tab | null) => {
		if (!value) return

		const activeTab = tabs.find(isTabActive)
		if (activeTab && activeTab.value !== value.value) router.push(value.value)
		return
	}

	return (
		<div className='pt-10 pb-16'>
			<div className='px-4 sm:px-6 lg:px-0'>
				<h1 className='text-3xl font-bold tracking-tight text-neutral-900'>
					Settings
				</h1>
			</div>
			<div className='px-4 sm:px-6 lg:px-0'>
				<div className='py-6'>
					{/* Tabs */}
					<div className='lg:hidden'>
						<Select
							label='Select a tab'
							labelClass='sr-only'
							options={tabs}
							selected={tabs.find(isTabActive) || null}
							onChange={(value) => handleChangeTab(value)}
							selectedOptionIcon={
								<Icon id='check' className='h-5 w-5' hidden />
							}
							iconDirection='right'
						/>
					</div>
					<div className='hidden lg:block'>
						<div className='border-b border-neutral-200'>
							<nav className='-mb-px flex space-x-8'>
								{tabs.map((tab) => (
									<Link
										key={tab.value}
										href={tab.value}
										className={twMerge(
											isTabActive(tab)
												? 'border-primary-500 text-primary-600'
												: 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700',
											'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
										)}
									>
										{tab.display}
									</Link>
								))}
							</nav>
						</div>
					</div>
					{children}
				</div>
			</div>
		</div>
	)
}
