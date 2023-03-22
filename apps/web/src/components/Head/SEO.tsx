import { nextBaseUrl } from '@/utils/url'
import Head from 'next/head'

export interface SEOProps {
	title?: string
	description?: string
	imageUrl?: string
	subredditId?: string
	postId?: string
	commentId?: string
}

const siteTitle = 'Readit - Dive into anything'
const siteDescription =
	"Readit is a network of communities where people can dive into their interests, hobbies and passions. There's a community for whatever you're interested in on Readit."
const twitterUsername = '@mpradorbrandy'
const defaultImageUrl = 'icon.png'

export const SEO = ({
	title = '',
	description,
	imageUrl,
	subredditId,
	commentId,
	postId,
}: SEOProps): JSX.Element => {
	//Notes on /og
	//- Check for errors in case you get ratelimited though not sure if cloudflare cdn will ratelimit cloudflare workers
	//- If you get an error, fallback to defaultImageUrl
	//- For logic, fetch the resource and render it
	//- If the resource has an image (eg. subreddit logo or post image), it's the caller of this component's responsibility to fetch that (included when calling the resource) and pass it as imageUrl
	const getOgImage = () => {
		if (imageUrl) return imageUrl
		if (commentId) return `${nextBaseUrl}/api/og?commentId=${commentId}`
		if (postId) return `${nextBaseUrl}/api/og?postId=${postId}`
		if (subredditId) return `${nextBaseUrl}/api/og?subredditId=${subredditId}`
		return defaultImageUrl
	}

	const image = getOgImage()

	return (
		<Head>
			<title>{`${title} | ${siteTitle}`}</title>
			<meta
				name='description'
				content={description || siteDescription}
				key='description'
			/>
			<meta name='image' content={image} key='image' />

			{/* facebook cards */}
			<meta property='og:url' content={nextBaseUrl} key='og:url' />
			<meta property='og:type' content='website' key='og:type' />
			<meta property='og:title' content={siteTitle} key='og:title' />
			<meta
				property='og:description'
				content={siteDescription}
				key='og:description'
			/>
			<meta property='og:image' content={`${image}`} key='og:image' />
			<meta property='og:image:width' content='400' key='og:image:width' />
			<meta property='og:image:height' content='300' key='og:image:height' />
			<meta key='og_locale' property='og:locale' content='en_IE' />
			<meta key='og_site_name' property='og:site_name' content={siteTitle} />

			{/* twitter card */}
			<meta
				name='twitter:card'
				content='summary_large_image'
				key='twitter:card'
			/>
			<meta
				name='twitter:creator'
				content={twitterUsername}
				key='twitter:creator'
			/>
			<meta name='twitter:title' content={siteTitle} key='twitter:title' />
			<meta
				name='twitter:description'
				content={siteDescription}
				key='twitter:description'
			/>
			<meta key='twitter:site' name='twitter:site' content={twitterUsername} />
			<meta name='twitter:image' content={`${image}`} key='twitter:image' />

			<link rel='canonical' href={nextBaseUrl} />
			<link rel='shortcut icon' href='/favicon.ico' />
			{/* Ignored by twitter but can be used by slack
			 *<meta name='twitter:label1' value='Opens in Theaters' />
			 *<meta name='twitter:data1' value='December 1, 2015' />
			 *<meta name='twitter:label2' value='Or on demand' />
			 *<meta name='twitter:data2' value='at Hulu.com' />
			 */}
		</Head>
	)
}
