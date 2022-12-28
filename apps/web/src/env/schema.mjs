import { z } from 'zod'

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
	//DATABASE_URL: z.string().url(),
	NODE_ENV: z.enum(['development', 'test', 'production']),
	VERCEL_URL: z.optional(z.string().url()),
	PORT: z.optional(z.union([z.number().int().positive(), z.string()])),
	API_URL: z.string(),
	APP_NAME: z.string(),
	VERCEL_ENV: z.enum(['development', 'preview', 'production']),
	EDGE_CONFIG: z.string(),
	ANALYZE: z.optional(z.string()),
})

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
	// NEXT_PUBLIC_BAR: z.string(),
	NEXT_PUBLIC_API_URL: z.string(),
})

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
	// NEXT_PUBLIC_BAR: process.env.NEXT_PUBLIC_BAR,
	NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
}
