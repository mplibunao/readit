/*
 * From https://github.com/elierotenberg/fastify-zod/blob/master/src/JsonSchema.ts
 * Since we don't need swagger docs and openapi, we can just get what we need
 * Package is heavy and doesn't seem well maintained
 */

import { z, ZodType } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export type Models<Key extends string = string> = {
	readonly [K in Key]: ZodType<unknown>
}

export type SchemaKey<M extends Models> = M extends Models<infer Key>
	? Key & string
	: never

export type SchemaKeyOrDescription<M extends Models> =
	| SchemaKey<M>
	| {
			readonly description: string
			readonly key: SchemaKey<M>
	  }

export type BuildJsonSchemasOptions = {
	readonly $id?: string
	readonly target?: `jsonSchema7` | `openApi3`
}

type $Ref<M extends Models> = (key: SchemaKeyOrDescription<M>) => {
	readonly $ref: string
	readonly description?: string
}

export type JsonSchema = {
	readonly $id: string
}

export type BuildJsonSchemasResult<M extends Models> = {
	readonly schemas: JsonSchema[]
	readonly $ref: $Ref<M>
}

export const buildJsonSchemas = <M extends Models>(
	models: M,
	opts: BuildJsonSchemasOptions = {},
): BuildJsonSchemasResult<M> => {
	const zodSchema = z.object(models)

	const $id = opts.$id ?? `Schema`

	const zodJsonSchema = zodToJsonSchema(zodSchema, {
		target: opts.target,
		basePath: [`${$id}#`],
	})

	const jsonSchema: JsonSchema = {
		$id,
		...zodJsonSchema,
	}

	const $ref: $Ref<M> = (key) => {
		const $ref = `${$id}#/properties/${typeof key === `string` ? key : key.key}`
		return typeof key === `string`
			? {
					$ref,
			  }
			: {
					$ref,
					description: key.description,
			  }
	}

	return {
		schemas: [jsonSchema],
		$ref,
	}
}
