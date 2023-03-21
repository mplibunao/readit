import { AlreadyExists, AppError } from '@api/utils/errors/baseError'

export type CreateCommunityErrors =
	| MustHavePrimaryTagToCreateSecondaryTags
	| AlreadyExists
	| PrimaryTagCannotBeSecondaryTag

export class MustHavePrimaryTagToCreateSecondaryTags extends AppError {
	static readonly type =
		'Community cannot have secondary tags without primary tag'

	constructor({
		message = 'You have tried to select secondary tags without selecting a primary tag',
	}) {
		super({ type: MustHavePrimaryTagToCreateSecondaryTags.type, message })
		this.name = MustHavePrimaryTagToCreateSecondaryTags.type
	}
}

export class PrimaryTagCannotBeSecondaryTag extends AppError {
	static readonly type = 'Primary tag cannot be a secondary tag'

	constructor({
		message = 'You have tried to select a primary tag as a secondary tag. Please make sure that the primary tag is not selected as a secondary tag',
	}) {
		super({ type: PrimaryTagCannotBeSecondaryTag.type, message })
		this.name = PrimaryTagCannotBeSecondaryTag.type
	}
}
