import { Layout, MainLayout } from '@/components/Layout'
import { Post } from '@/components/Posts/Post'
import { TimelineTabs } from '@/components/Tabs/TimelineTabs'
import { posts } from '@/constants/posts'

import { NextPageWithLayout } from './_app'

const IndexPage: NextPageWithLayout = () => {
	return (
		<>
			<TimelineTabs />
			<div className='mt-4'>
				<h1 className='sr-only'>Recent questions</h1>
				<ul role='list' className='space-y-4'>
					{posts.map((post) => (
						<Post key={post.id} post={post} />
					))}

					{posts.map((post) => (
						<Post key={post.id} post={post} />
					))}

					{posts.map((post) => (
						<Post key={post.id} post={post} />
					))}

					{posts.map((post) => (
						<Post key={post.id} post={post} />
					))}
					{posts.map((post) => (
						<Post key={post.id} post={post} />
					))}
					{posts.map((post) => (
						<Post key={post.id} post={post} />
					))}
				</ul>
			</div>
		</>
	)
}

IndexPage.getLayout = (page) => (
	<Layout>
		<MainLayout>{page}</MainLayout>
	</Layout>
)
export default IndexPage
