import { Avatar } from '@/components/Avatar'
import { Icon } from '@/components/Icon'
import { client } from '@/utils/trpc/client'
import { RecommendationSchemas } from '@api/modules/recommendations/domain/recommendation.schema'
import * as Toggle from '@radix-ui/react-toggle'
import { twMerge } from 'tailwind-merge'

import { ToggleCommunityRecommendationProps, useDicoverCommunities } from '.'

export const CommunityRecommendationList = (): JSX.Element => {
	const {
		recommendations,
		toggleCommunityRecommendation,
		recommendationNumber,
		addTagRecommendedCommunities,
		selectAllTagCommunities,
		deselectAllTagCommunities,
		selectedCommunities,
	} = useDicoverCommunities()

	const getMoreRecommendedCommunities =
		client.recommendation.getMoreRecommendedCommunities.useMutation({
			onSuccess: (data) => {
				addTagRecommendedCommunities(data)
			},
		})

	const handleGetMoreRecommendations = (
		recommendation: RecommendationSchemas.CommunityRecommendation,
	) => {
		const offsetNum = 1 + recommendationNumber
		const recommendationNum = recommendation.communities.length + offsetNum

		getMoreRecommendedCommunities.mutate({
			tagId: recommendation.tagId,
			recommendationNum,
			limit: recommendationNumber,
			offset: recommendationNum - offsetNum,
		})
	}

	return (
		<nav
			className='h-full overflow-y-auto'
			aria-label='Community recommendations'
		>
			{Array.from(recommendations.entries()).map(([id, recommendation]) => {
				const allSelected = isAllSelected({ recommendation })
				return (
					<div key={id} className='relative'>
						<div className='sticky top-0 z-10 border-t border-b border-neutral-200 bg-neutral-50 px-6 py-1 text-sm font-medium text-neutral-500 flex justify-between'>
							<h3>{recommendation.tag}</h3>
							<Toggle.Root
								className='hover:text-neutral-400 text-xs'
								pressed={allSelected}
								onPressedChange={(newValue) =>
									newValue
										? selectAllTagCommunities(recommendation.tagId)
										: deselectAllTagCommunities(recommendation.tagId)
								}
							>
								{allSelected ? 'Deselect All' : 'Select All'}
							</Toggle.Root>
						</div>
						<ul
							role='list'
							className='relative z-0 divide-y divide-neutral-200'
						>
							{recommendation.communities.map((community) => (
								<CommunityItem
									community={community}
									key={`tag:${recommendation.tagId}-community:${community.id}-${community.name}`}
									toggleRecommendation={toggleCommunityRecommendation}
									tagId={recommendation.tagId}
									selectedCommunities={selectedCommunities}
								/>
							))}
							{!recommendation?.noMoreCommunities ? (
								<button
									className='hover:text-neutral-400 bg-white hover:bg-neutral-100 px-6 py-2 text-xs font-medium text-neutral-500 flex justify-center border-transparent w-full'
									onClick={() => handleGetMoreRecommendations(recommendation)}
								>
									Show more
								</button>
							) : null}
						</ul>
					</div>
				)
			})}
		</nav>
	)
}

function isAllSelected({
	recommendation,
}: {
	recommendation: RecommendationSchemas.CommunityRecommendation
}) {
	if (recommendation.allSelected) {
		return true
	}

	if (recommendation.allUnselected) {
		return false
	}

	return false
}

const CommunityItem = ({
	community,
	toggleRecommendation,
	tagId,
	selectedCommunities,
}: {
	community: RecommendationSchemas.RecommendationCommunity
	toggleRecommendation: (params: ToggleCommunityRecommendationProps) => void
	tagId: string
	selectedCommunities: Map<string, boolean>
}) => {
	const isSelected = selectedCommunities.get(community.id) ?? false
	return (
		<Toggle.Root
			className={twMerge(
				'flex w-full justify-between items-center focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 px-6 py-5',
				isSelected
					? 'bg-primary-100 hover:bg-primary-50'
					: 'hover:bg-neutral-50',
			)}
			pressed={isSelected}
			aria-label={`${
				isSelected ? 'Deselect' : 'Select'
			} recommended community ${community.name}`}
			onPressedChange={(selected) =>
				toggleRecommendation({ tagId, communityId: community.id, selected })
			}
		>
			<li>
				<div className='relative flex items-center space-x-3'>
					<div className='flex-shrink-0'>
						<Avatar size='md' name={community.name} src={community.imageUrl} />
					</div>
					<div className='min-w-0 flex-1'>
						<p className='text-sm font-medium text-neutral-900 flex justify-start'>
							{community.name}
						</p>
						<span className='flex justify-start'>
							<p className='break-normal text-xs text-neutral-500 text-left'>
								{community.description}
							</p>
						</span>
					</div>
				</div>
			</li>
			<Icon
				id={isSelected ? 'check' : 'plus'}
				className={twMerge(
					'w-6 h-6 min-w-[24px]',
					isSelected ? 'text-primary-500' : 'text-neutral-500',
				)}
				hidden
			/>
		</Toggle.Root>
	)
}
