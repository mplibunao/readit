import { Avatar } from '@/components/Avatar'
import { Icon } from '@/components/Icon'
import { RecommendationSchemas } from '@api/modules/recommendations/domain/recommendation.schema'
import * as Toggle from '@radix-ui/react-toggle'
import { twMerge } from 'tailwind-merge'

import { ToggleCommunityRecommendationProps, useDicoverCommunities } from '.'

export const CommunityRecommendationList = (): JSX.Element => {
	const {
		recommendations,
		toggleRecommendation,
		toggleSelectAllTagCommunities,
	} = useDicoverCommunities()
	return (
		<nav
			className='h-full overflow-y-auto'
			aria-label='Community recommendations'
		>
			{Object.entries(recommendations).map(([id, recommendation]) => {
				const allSelected = isAllSelected({ recommendation })
				return (
					<div key={id} className='relative'>
						<div className='sticky top-0 z-10 border-t border-b border-neutral-200 bg-neutral-50 px-6 py-1 text-sm font-medium text-neutral-500 flex justify-between'>
							<h3>{recommendation.tag}</h3>
							<Toggle.Root
								className='hover:text-neutral-400 text-xs'
								pressed={allSelected}
								onPressedChange={(newValue) =>
									toggleSelectAllTagCommunities(newValue, recommendation.tagId)
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
									key={community.id}
									toggleRecommendation={toggleRecommendation}
									tagId={recommendation.tagId}
								/>
							))}
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
	recommendation: RecommendationSchemas.CommunityRecommendationsTag
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
}: {
	community: RecommendationSchemas.CommunityRecommendationsCommunity
	toggleRecommendation: (params: ToggleCommunityRecommendationProps) => void
	tagId: string
}) => {
	return (
		<Toggle.Root
			className={twMerge(
				'flex w-full justify-between items-center focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 px-6 py-5',
				community.selected
					? 'bg-primary-100 hover:bg-primary-50'
					: 'hover:bg-neutral-50',
			)}
			pressed={community.selected}
			aria-label={`${
				community.selected ? 'Deselect' : 'Select'
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
				id={community.selected ? 'check' : 'plus'}
				className={twMerge(
					'w-6 h-6 min-w-[24px]',
					community.selected ? 'text-primary-500' : 'text-neutral-500',
				)}
				hidden
			/>
		</Toggle.Root>
	)
}
