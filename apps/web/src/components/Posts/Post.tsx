import { TempPost } from '@/constants/posts'

//import { Menu, Transition } from '@headlessui/react'
//import { Fragment } from 'react'
//import { twMerge } from 'tailwind-merge'

import { Icon } from '../Icon'
import { PostActions } from './PostActions'

export interface PostProps {
	post: TempPost
}

export const Post = ({ post }: PostProps): JSX.Element => {
	return (
		<li
			key={post.id}
			className='bg-white px-4 py-6 shadow sm:rounded-lg sm:p-6'
		>
			<article aria-labelledby={'question-title-' + post.id}>
				<div>
					<div className='flex space-x-3'>
						<div className='flex-shrink-0'>
							<img
								className='h-10 w-10 rounded-full'
								src={post.author.imageUrl}
								alt=''
							/>
						</div>
						<div className='min-w-0 flex-1'>
							<p className='text-sm font-medium text-gray-900'>
								<a href={post.author.href} className='hover:underline'>
									{post.author.name}
								</a>
							</p>
							<p className='text-sm text-gray-500'>
								<a href={post.href} className='hover:underline'>
									<time dateTime={post.datetime}>{post.date}</time>
								</a>
							</p>
						</div>
						<PostActions />
					</div>
					<h2
						id={'question-title-' + post.id}
						className='mt-4 text-base font-medium text-gray-900'
					>
						{post.title}
					</h2>
				</div>
				<div
					className='mt-2 space-y-4 text-sm text-gray-700'
					dangerouslySetInnerHTML={{ __html: post.body }}
				/>
				<div className='mt-6 flex justify-between space-x-8'>
					<div className='flex space-x-6'>
						<span className='inline-flex items-center text-sm'>
							<button
								type='button'
								className='inline-flex space-x-2 text-gray-400 hover:text-gray-500'
							>
								<Icon
									className='h-5 w-5'
									id='hand-thumb-up'
									label='Upvote post'
								/>
							</button>
						</span>
						<span className='inline-flex items-center text-sm'>
							<span className='font-medium text-gray-900'>{post.likes}</span>
						</span>
						<span className='inline-flex items-center text-sm'>
							<button
								type='button'
								className='inline-flex space-x-2 text-gray-400 hover:text-gray-500'
							>
								<Icon
									className='h-5 w-5'
									id='hand-thumb-down'
									label='Downvote post'
								/>
							</button>
						</span>
						<span className='inline-flex items-center text-sm'>
							<button
								type='button'
								className='inline-flex space-x-2 text-gray-400 hover:text-gray-500'
							>
								<Icon
									id='chat-bubble-left-ellipsis'
									className='h-5 w-5'
									label='Reply to post'
								/>
								<span className='font-medium text-gray-900'>
									{post.replies}
								</span>
							</button>
						</span>
						<span className='inline-flex items-center text-sm'>
							<button
								type='button'
								className='inline-flex space-x-2 text-gray-400 hover:text-gray-500'
							>
								<Icon id='eye' className='h-5 w-5' label='Views' />
								<span className='font-medium text-gray-900'>{post.views}</span>
							</button>
						</span>
					</div>
					<div className='flex text-sm'>
						<span className='inline-flex items-center text-sm'>
							<button
								type='button'
								className='inline-flex space-x-2 text-gray-400 hover:text-gray-500'
							>
								<Icon id='share' className='h-5 w-5' label='Share post' />
								<span className='font-medium text-gray-900'>Share</span>
							</button>
						</span>
					</div>
				</div>
			</article>
		</li>
	)
}
