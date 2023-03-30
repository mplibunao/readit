import { faker } from '@faker-js/faker'
import argon2 from 'argon2'
import { Insertable } from 'kysely'

import { db } from './db'
import type { DB } from './db.d'

const DEFAULT_PASSWORD = 'Password1'
const createUser = async (
	params: Partial<
		Omit<Insertable<DB['users']>, 'hashedPassword'> & { password?: string }
	> = {},
): Promise<Insertable<DB['users']>> => {
	const firstName = faker.name.firstName()
	const lastName = faker.name.lastName()
	const hashedPassword = await argon2.hash(params.password || DEFAULT_PASSWORD)

	return {
		email: faker.internet.email(),
		firstName,
		lastName,
		username: faker.internet.userName(firstName, lastName),
		hashedPassword,
		confirmedAt: 'NOW()',
		...params,
	}
}

const createCommunity = (
	params: Partial<Insertable<DB['communities']>> = {},
): Insertable<DB['communities']> => {
	const name = `${faker.word.adjective({
		strategy: 'closest',
		length: { min: 3, max: 10 },
	})}${faker.word.noun({
		strategy: 'closest',
		length: { min: 3, max: 10 },
	})}`

	return {
		name,
		description: faker.lorem.sentence(),
		isNsfw: faker.datatype.boolean(),
		...params,
	}
}

const createTag = (
	params: Partial<Insertable<DB['tags']>>,
): Insertable<DB['tags']> => {
	return {
		name: faker.lorem.word(),
		isRecommended: true,
		...params,
	}
}

export const seed = async () => {
	console.log('Seeding database...')

	const admin = await createUser({
		email: 'support@mplibunao.tech',
		username: 'mplibunao-admin',
		firstName: 'Mark',
		lastName: 'Libunao',
		isAdmin: true,
	})
	console.info(admin, 'admin')

	const adminResult = await db
		.insertInto('users')
		.values(admin)
		.returningAll()
		.execute()
	console.info(adminResult, 'Admin seed result')

	const tags = [
		'Activism',
		'Addiction Support',
		'Animals And Pets',
		'Anime',
		'Art',
		'Beauty And Makeup',
		'Business, Economics, And Finance',
		'Careers',
		'Cars And Motor Vehicles',
		'Celebrity',
		'Crafts And DIY',
		'Crypto',
		'Culture, Race, And Ethnicity',
		'Ethics And Philosophy',
		'Family And Relationships',
		'Fashion',
		'Fitness And Nutrition',
		'Food And Drink',
		'Funny/Humor',
		'Gaming',
		'Gender',
		'History',
		'Hobbies',
		'Home And Garden',
		'Internet Culture And Memes',
		'Law',
		'Learning And Education',
		'Marketplace And Deals',
		'Mature Themes And Adult Content',
		'Medical And Mental Health',
		"Men's Health",
		'Meta/Reddit',
		'Military',
		'Movies',
		'Music',
		'Outdoors And Nature',
		'Place',
		'Podcasts And Streamers',
		'Politics',
		'Programming',
		'Reading, Writing, And Literature',
		'Religion And Spirituality',
		'Science',
		'Sexual Orientation',
		'Sports',
		'Tabletop Games',
		'Technology',
		'Television',
		'Trauma Support',
		'Travel',
		"Women's Health",
		'World News',
		'None Of These Topics',
	].map((name) => createTag({ name }))

	const tagsResult = await db
		.insertInto('tags')
		.values(tags)
		.returningAll()
		.execute()
	console.info(tagsResult, 'tagsResult')

	const communities = [
		{
			name: 'reactjs',
			description:
				'A community for developers who use ReactJS to build web applications.',
			isNsfw: false,
		},
		{
			name: 'petlovers',
			description:
				'A community for pet owners to share photos, stories, and tips.',
			isNsfw: false,
		},
		{
			name: 'fitness',
			description:
				'A community for fitness enthusiasts to discuss workouts, nutrition, and health.',
			isNsfw: false,
		},
		{
			name: 'foodies',
			description:
				'A community for food lovers to share recipes, restaurant recommendations, and culinary experiences.',
			isNsfw: false,
		},
		{
			name: 'worldtravelers',
			description:
				'A community for people who love to explore new destinations and cultures.',
			isNsfw: false,
		},
		{
			name: 'videogamers',
			description:
				'A community for gamers to share their favorite video games, tips, and strategies.',
			isNsfw: false,
		},
		{
			name: 'moviesandtv',
			description:
				'A community for fans of movies and TV shows to discuss their favorite films, TV series, and actors.',
			isNsfw: false,
		},
		{
			name: 'bookclub',
			description:
				'A community for book lovers to share their favorite reads and discuss literature.',
			isNsfw: false,
		},
		{
			name: 'artcollectors',
			description:
				'A community for art enthusiasts to share their favorite works and discuss art history.',
			isNsfw: false,
		},
		{
			name: 'crafters',
			description:
				'A community for people who enjoy crafting to share their projects and connect with other crafters.',
			isNsfw: false,
		},
		{
			name: 'fitnessmotivation',
			description:
				'A community for people looking to get fit and stay motivated to achieve their fitness goals.',
			isNsfw: false,
		},
		{
			name: 'musicians',
			description:
				'A community for musicians to share their music, connect with other musicians, and collaborate on projects.',
			isNsfw: false,
		},
		{
			name: 'entrepreneurship',
			description:
				'A community for entrepreneurs to share their experiences, discuss business strategies, and network with other entrepreneurs.',
			isNsfw: false,
		},
		{
			name: 'outdoors',
			description:
				'A community for nature enthusiasts to share their experiences and connect with others who enjoy the great outdoors.',
			isNsfw: false,
		},
		{
			name: 'historybuffs',
			description:
				'A community for people who are interested in history to discuss historical events, figures, and cultures.',
			isNsfw: false,
		},
		{
			name: 'carmechanics',
			description:
				'A community for car enthusiasts and mechanics to discuss car maintenance, modifications, and repairs.',
			isNsfw: false,
		},
		{
			name: 'cryptocurrency',
			description:
				'A community for people interested in cryptocurrency to discuss the latest trends and news in the crypto world.',
			isNsfw: false,
		},
		{
			name: 'nextjs',
			description:
				'A community for developers who use NextJS to build web applications.',
			isNsfw: false,
		},
		{
			name: 'node',
			description:
				'A community for developers who use NodeJS to build web applications.',
			isNsfw: false,
		},
		{
			name: 'AWSCertifications',
			description:
				'A community for people interested in AWS certifications to discuss the latest trends and news in the AWS world.',
			isNsfw: false,
		},
		{
			name: 'javascript',
			description:
				'A community for developers who use JavaScript to build web applications.',
			isNsfw: false,
		},
		{
			name: 'googlecloud',
			description:
				'A community for people interested in Google Cloud to discuss the latest trends and news in the Google Cloud world.',
			isNsfw: false,
		},
		{
			name: 'ExperiencedDevs',
			description:
				'A community for experienced developers to discuss the latest trends and news in the tech world.',
			isNsfw: false,
		},
		{
			name: 'AnimeART',
			description:
				'A community for anime artists to share their work and connect with other artists.',
			isNsfw: false,
		},
		{
			name: 'Anime',
			description:
				'A community for anime fans to discuss their favorite anime series, characters, and voice actors.',
			isNsfw: false,
		},
		{
			name: 'manganews',
			description:
				'A community for manga fans to discuss the latest manga releases and news.',
			isNsfw: false,
		},
		{
			name: 'ShieldHero',
			description:
				'A community for fans of The Rising of the Shield Hero to discuss the anime and manga series.',
			isNsfw: false,
		},
		{
			name: 'BlackClover',
			description:
				'A community for fans of Black Clover to discuss the anime and manga series.',
			isNsfw: false,
		},
		{
			name: 'genshinimpact',
			description:
				'A community for fans of Genshin Impact to discuss the game and share their experiences.',
			isNsfw: false,
		},
		{
			name: 'leagueoflegends',
			description:
				'A community for fans of League of Legends to discuss the game and share their experiences.',
			isNsfw: false,
		},
		{
			name: 'CounterStrike',
			description:
				'A community for fans of Counter-Strike to discuss the game and share their experiences.',
			isNsfw: false,
		},
		{
			name: 'Overwatch',
			description:
				'A community for fans of Overwatch to discuss the game and share their experiences.',
			isNsfw: false,
		},
		{
			name: 'Dota2',
			description:
				'A community for fans of Dota 2 to discuss the game and share their experiences.',
			isNsfw: false,
		},
		{
			name: 'bodyweightfitness',
			description:
				'A community for people who want to get fit without using any equipment to discuss their fitness goals and share their experiences.',
			isNsfw: false,
		},
		{
			name: 'GripTraining',
			description:
				'A community for people who want to improve their grip strength to discuss their fitness goals and share their experiences.',
			isNsfw: false,
		},
		{
			name: 'overcominggravity',
			description:
				'A community for people who want to improve their flexibility to discuss their fitness goals and share their experiences.',
			isNsfw: false,
		},
		{
			name: 'Parkour',
			description:
				'A community for people who want to improve their parkour skills to discuss their fitness goals and share their experiences.',
			isNsfw: false,
		},
		{
			name: 'phinvest',
			description:
				'A community for people who want to learn more about investing in the Philippines to discuss their investment goals and share their experiences.',
			isNsfw: false,
		},
		{
			name: 'wallstreetbets',
			description:
				'A community for people who want to learn more about investing in the stock market to discuss their investment goals and share their experiences.',
			isNsfw: false,
		},
	].map((params) => createCommunity(params))

	const communitiesResult = await db
		.insertInto('communities')
		.values(communities)
		.returningAll()
		.execute()
	console.info(communitiesResult, 'communitiesResult')

	const communityTags = [
		{
			communityName: 'reactjs',
			tagName: 'Programming',
			isPrimary: true,
		},
		{
			communityName: 'reactjs',
			tagName: 'Technology',
			isPrimary: false,
		},
		{
			communityName: 'reactjs',
			tagName: 'Science',
			isPrimary: false,
		},
		{
			communityName: 'nextjs',
			tagName: 'Programming',
			isPrimary: true,
		},
		{
			communityName: 'nextjs',
			tagName: 'Technology',
			isPrimary: false,
		},
		{
			communityName: 'node',
			tagName: 'Technology',
			isPrimary: true,
		},
		{
			communityName: 'node',
			tagName: 'Programming',
			isPrimary: false,
		},
		{
			communityName: 'AWSCertifications',
			tagName: 'Technology',
			isPrimary: true,
		},
		{
			communityName: 'AWSCertifications',
			tagName: 'Programming',
			isPrimary: false,
		},
		{
			communityName: 'AWSCertifications',
			tagName: 'Careers',
			isPrimary: false,
		},
		{
			communityName: 'AWSCertifications',
			tagName: 'Learning And Education',
			isPrimary: false,
		},
		{
			communityName: 'javascript',
			tagName: 'Programming',
			isPrimary: true,
		},
		{
			communityName: 'javascript',
			tagName: 'Technology',
			isPrimary: false,
		},
		{
			communityName: 'googlecloud',
			tagName: 'Technology',
			isPrimary: true,
		},
		{
			communityName: 'googlecloud',
			tagName: 'Programming',
			isPrimary: false,
		},
		{
			communityName: 'googlecloud',
			tagName: 'Programming',
			isPrimary: false,
		},
		{
			communityName: 'ExperiencedDevs',
			tagName: 'Programming',
			isPrimary: true,
		},
		{
			communityName: 'ExperiencedDevs',
			tagName: 'Technology',
			isPrimary: false,
		},
		{
			communityName: 'ExperiencedDevs',
			tagName: 'Careers',
			isPrimary: false,
		},
		{
			communityName: 'AnimeART',
			tagName: 'Art',
			isPrimary: true,
		},
		{
			communityName: 'AnimeART',
			tagName: 'Anime',
			isPrimary: false,
		},
		{
			communityName: 'Anime',
			tagName: 'Anime',
			isPrimary: true,
		},
		{
			communityName: 'Anime',
			tagName: 'Television',
			isPrimary: false,
		},
		{
			communityName: 'manganews',
			tagName: 'Anime',
			isPrimary: true,
		},
		{
			communityName: 'ShieldHero',
			tagName: 'Anime',
			isPrimary: true,
		},
		{
			communityName: 'ShieldHero',
			tagName: 'Television',
			isPrimary: false,
		},
		{
			communityName: 'BlackClover',
			tagName: 'Anime',
			isPrimary: true,
		},
		{
			communityName: 'BlackClover',
			tagName: 'Television',
			isPrimary: false,
		},

		{
			communityName: 'petlovers',
			tagName: 'Animals And Pets',
			isPrimary: true,
		},
		{
			communityName: 'fitness',
			tagName: 'Fitness And Nutrition',
			isPrimary: true,
		},
		{
			communityName: 'fitness',
			tagName: 'Sports',
			isPrimary: false,
		},
		{
			communityName: 'foodies',
			tagName: 'Food And Drink',
			isPrimary: true,
		},
		{
			communityName: 'worldtravelers',
			tagName: 'Travel',
			isPrimary: true,
		},
		{
			communityName: 'worldtravelers',
			tagName: 'Culture, Race, And Ethnicity',
			isPrimary: false,
		},
		{
			communityName: 'worldtravelers',
			tagName: 'Language Learning',
			isPrimary: false,
		},
		{
			communityName: 'worldtravelers',
			tagName: 'History',
			isPrimary: false,
		},
		{
			communityName: 'worldtravelers',
			tagName: 'Outdoors And Nature',
			isPrimary: false,
		},
		{
			communityName: 'worldtravelers',
			tagName: 'Food And Drink',
			isPrimary: false,
		},
		{
			communityName: 'worldtravelers',
			tagName: 'Art',
			isPrimary: false,
		},
		{
			communityName: 'worldtravelers',
			tagName: 'Music',
			isPrimary: false,
		},
		{
			communityName: 'worldtravelers',
			tagName: 'Photography',
			isPrimary: false,
		},
		{
			communityName: 'worldtravelers',
			tagName: 'Fashion',
			isPrimary: false,
		},
		{
			communityName: 'videogamers',
			tagName: 'Gaming',
			isPrimary: true,
		},
		{
			communityName: 'genshinimpact',
			tagName: 'Gaming',
			isPrimary: true,
		},
		{
			communityName: 'genshinimpact',
			tagName: 'Anime',
			isPrimary: false,
		},
		{
			communityName: 'leagueoflegends',
			tagName: 'Gaming',
			isPrimary: true,
		},
		{
			communityName: 'leagueoflegends',
			tagName: 'Sports',
			isPrimary: false,
		},
		{
			communityName: 'CounterStrike',
			tagName: 'Gaming',
			isPrimary: true,
		},
		{
			communityName: 'CounterStrike',
			tagName: 'Sports',
			isPrimary: false,
		},
		{
			communityName: 'Overwatch',
			tagName: 'Gaming',
			isPrimary: true,
		},
		{
			communityName: 'Overwatch',
			tagName: 'Sports',
			isPrimary: false,
		},
		{
			communityName: 'Dota2',
			tagName: 'Gaming',
			isPrimary: true,
		},
		{
			communityName: 'Dota2',
			tagName: 'Sports',
			isPrimary: false,
		},
		{
			communityName: 'moviesandtv',
			tagName: 'Movies',
			isPrimary: true,
		},
		{
			communityName: 'moviesandtv',
			tagName: 'Television',
			isPrimary: false,
		},
		{
			communityName: 'bookclub',
			tagName: 'Reading, Writing, And Literature',
			isPrimary: true,
		},
		{
			communityName: 'artcollectors',
			tagName: 'Art',
			isPrimary: true,
		},
		{
			communityName: 'crafters',
			tagName: 'Crafts And DIY',
			isPrimary: true,
		},
		{
			communityName: 'fitnessmotivation',
			tagName: 'Fitness And Nutrition',
			isPrimary: true,
		},
		{
			communityName: 'bodyweightfitness',
			tagName: 'Fitness And Nutrition',
			isPrimary: true,
		},
		{
			communityName: 'bodyweightfitness',
			tagName: 'Sports',
			isPrimary: false,
		},
		{
			communityName: 'GripTraining',
			tagName: 'Fitness And Nutrition',
			isPrimary: true,
		},
		{
			communityName: 'overcominggravity',
			tagName: 'Fitness And Nutrition',
			isPrimary: false,
		},
		{
			communityName: 'overcominggravity',
			tagName: 'Sports',
			isPrimary: true,
		},
		{
			communityName: 'Parkour',
			tagName: 'Sports',
			isPrimary: true,
		},
		{
			communityName: 'Parkour',
			tagName: 'Fitness And Nutrition',
			isPrimary: false,
		},
		{
			communityName: 'musicians',
			tagName: 'Music',
			isPrimary: true,
		},
		{
			communityName: 'entrepreneurship',
			tagName: 'Business, Economics, And Finance',
			isPrimary: true,
		},
		{
			communityName: 'outdoors',
			tagName: 'Outdoors And Nature',
			isPrimary: true,
		},
		{
			communityName: 'historybuffs',
			tagName: 'History',
			isPrimary: true,
		},
		{
			communityName: 'carmechanics',
			tagName: 'Cars And Motor Vehicles',
			isPrimary: true,
		},
		{
			communityName: 'cryptocurrency',
			tagName: 'Crypto',
			isPrimary: true,
		},
		{
			communityName: 'cryptocurrency',
			tagName: 'Technology',
			isPrimary: false,
		},
		{
			communityName: 'cryptocurrency',
			tagName: 'Business, Economics, And Finance',
			isPrimary: false,
		},
		{
			communityName: 'phinvest',
			tagName: 'Business, Economics, And Finance',
			isPrimary: true,
		},
		{
			communityName: 'phinvest',
			tagName: 'Crypto',
			isPrimary: false,
		},
		{
			communityName: 'phinvest',
			tagName: 'World News',
			isPrimary: false,
		},
		{
			communityName: 'phinvest',
			tagName: 'Politics',
			isPrimary: false,
		},
		{
			communityName: 'wallstreetbets',
			tagName: 'Business, Economics, And Finance',
			isPrimary: true,
		},
		{
			communityName: 'wallstreetbets',
			tagName: 'Crypto',
			isPrimary: false,
		},
		{
			communityName: 'wallstreetbets',
			tagName: 'World News',
			isPrimary: false,
		},
		{
			communityName: 'wallstreetbets',
			tagName: 'Politics',
			isPrimary: false,
		},
	]
		.map(({ communityName, tagName, isPrimary }) => {
			const communityId = communitiesResult.find(
				(community) => community.name === communityName,
			)?.id
			const tagId = tagsResult.find((tag) => tag.name === tagName)?.id

			if (!communityId || !tagId) {
				return null
			}

			return {
				communityId,
				tagId,
				isPrimary,
			}
		})
		.filter((communityTag) => !!communityTag) as Insertable<
		DB['communityTags']
	>[]

	const communityTagsResult = await db
		.insertInto('communityTags')
		.returningAll()
		.values(communityTags)
		.execute()

	console.info(communityTagsResult, 'communityTagsResult')

	console.log('Seeding complete')
	process.exit(0)
}

seed()
