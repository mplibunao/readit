import { Avatar } from '@/components/Avatar'
import { RecommendationSchemas } from '@api/modules/recommendations/domain/recommendation.schema'

export interface CommunityRecommendationListProps {
	recommendations: RecommendationSchemas.CommunityRecommendations
}

export const CommunityRecommendationList = ({
	recommendations,
}: CommunityRecommendationListProps): JSX.Element => {
	return (
		<div className='h-[300px] overflow-y-scroll mt-4'>
			<div className='' />
			<nav
				className='h-full overflow-y-auto'
				aria-label='Community recommendations'
			>
				{Object.entries(recommendations).map(([id, recommendation]) => (
					<div key={id} className='relative'>
						<div className='sticky top-0 z-10 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500'>
							<h3>{recommendation.tag}</h3>
						</div>
						<ul role='list' className='relative z-0 divide-y divide-gray-200'>
							{recommendation.communities.map((community) => (
								<li key={community.id} className='bg-white'>
									<div className='relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50'>
										<div className='flex-shrink-0'>
											<Avatar
												className='h-10 w-10 rounded-full'
												name={community.name}
												src={community.imageUrl}
											/>
										</div>
										<div className='min-w-0 flex-1'>
											<a href='#' className='focus:outline-none'>
												<span className='absolute inset-0' aria-hidden='true' />
												<p className='text-sm font-medium text-gray-900'>
													{community.name}
												</p>
												<span>
													<p className='break-normal text-xs text-gray-500'>
														{community.description}
													</p>
												</span>
											</a>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				))}
			</nav>
		</div>
	)
}
