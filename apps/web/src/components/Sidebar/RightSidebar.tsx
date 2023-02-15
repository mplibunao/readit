import { Icon } from '../Icon'

//export interface RightSidebarProps {}

const whoToFollow = [
	{
		name: 'Leonard Krasner',
		handle: 'leonardkrasner',
		href: '#',
		imageUrl:
			'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
	},
	// More people...
]
const trendingPosts = [
	{
		id: 1,
		user: {
			name: 'Floyd Miles',
			imageUrl:
				'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
		body: 'What books do you have on your bookshelf just to look smarter than you actually are?',
		comments: 291,
	},
	// More posts...
]

export const RightSidebar = (): JSX.Element => {
	return (
		<aside className='hidden xl:col-span-4 xl:block'>
			<div className='sticky top-4 space-y-4'>
				<section aria-labelledby='who-to-follow-heading'>
					<div className='rounded-lg bg-white shadow'>
						<div className='p-6'>
							<h2
								id='who-to-follow-heading'
								className='text-base font-medium text-gray-900'
							>
								Who to follow
							</h2>
							<div className='mt-6 flow-root'>
								<ul role='list' className='-my-4 divide-y divide-gray-200'>
									{whoToFollow.map((user) => (
										<li
											key={user.handle}
											className='flex items-center space-x-3 py-4'
										>
											<div className='flex-shrink-0'>
												<img
													className='h-8 w-8 rounded-full'
													src={user.imageUrl}
													alt=''
												/>
											</div>
											<div className='min-w-0 flex-1'>
												<p className='text-sm font-medium text-gray-900'>
													<a href={user.href}>{user.name}</a>
												</p>
												<p className='text-sm text-gray-500'>
													<a href={user.href}>{'@' + user.handle}</a>
												</p>
											</div>
											<div className='flex-shrink-0'>
												<button
													type='button'
													className='inline-flex items-center rounded-full bg-rose-50 px-3 py-0.5 text-sm font-medium text-rose-700 hover:bg-rose-100'
												>
													<Icon
														className='-ml-1 mr-0.5 h-5 w-5 text-rose-400'
														id='hand-thumb-up'
														label='Follow'
													/>
													<span>Follow</span>
												</button>
											</div>
										</li>
									))}
								</ul>
							</div>
							<div className='mt-6'>
								<a
									href='#'
									className='block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
								>
									View all
								</a>
							</div>
						</div>
					</div>
				</section>
				<section aria-labelledby='trending-heading'>
					<div className='rounded-lg bg-white shadow'>
						<div className='p-6'>
							<h2
								id='trending-heading'
								className='text-base font-medium text-gray-900'
							>
								Trending
							</h2>
							<div className='mt-6 flow-root'>
								<ul role='list' className='-my-4 divide-y divide-gray-200'>
									{trendingPosts.map((post) => (
										<li key={post.id} className='flex space-x-3 py-4'>
											<div className='flex-shrink-0'>
												<img
													className='h-8 w-8 rounded-full'
													src={post.user.imageUrl}
													alt={post.user.name}
												/>
											</div>
											<div className='min-w-0 flex-1'>
												<p className='text-sm text-gray-800'>{post.body}</p>
												<div className='mt-2 flex'>
													<span className='inline-flex items-center text-sm'>
														<button
															type='button'
															className='inline-flex space-x-2 text-gray-400 hover:text-gray-500'
														>
															<Icon
																className='h-5 w-5'
																label='Reply to post'
																id='chat-bubble-left-ellipsis'
															/>
															<span className='font-medium text-gray-900'>
																{post.comments}
															</span>
														</button>
													</span>
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>
							<div className='mt-6'>
								<a
									href='#'
									className='block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
								>
									View all
								</a>
							</div>
						</div>
					</div>
				</section>
			</div>
		</aside>
	)
}

export default RightSidebar
