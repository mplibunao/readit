import { Header } from '@/components/Header/Header'
import { Post } from '@/components/Posts/Post'
import RightSidebar from '@/components/Sidebar/RightSidebar'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { TimelineTabs } from '@/components/Tabs/TimelineTabs'
import { posts } from '@/constants/posts'
import { client } from '@/utils/trpc/client'
import { RouterOutput } from '@/utils/trpc/types'

const IndexPage = () => {
	const { data: user } = client.user.me.useQuery()
	const _user: RouterOutput['user']['me'] = {
		imageUrl:
			'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
		id: '1',
		username: 'johndoe',
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		confirmedAt: null,
	}

	return (
		<div className='min-h-full'>
			<Header user={user} />

			<div className='py-10'>
				<div className='mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8'>
					<div className='hidden lg:col-span-3 lg:block xl:col-span-2'>
						<Sidebar />
					</div>
					<main className='lg:col-span-9 xl:col-span-6'>
						<TimelineTabs />
						<div className='mt-4'>
							<h1 className='sr-only'>Recent questions</h1>
							<ul role='list' className='space-y-4'>
								{posts.map((post) => (
									<Post key={post.id} post={post} />
								))}
							</ul>
						</div>
					</main>
					<RightSidebar />
				</div>
			</div>
		</div>
	)
}

export default IndexPage
