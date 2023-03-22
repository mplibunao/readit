import { Dependencies } from '@api/infra/diConfig'
import { InsertableTag, Trx } from '@api/infra/pg/types'

import { TagRepository } from '../repositories/tag.repository'

export class TagService {
	private readonly TagRepository: TagRepository

	constructor({ TagRepository }: Dependencies) {
		this.TagRepository = TagRepository
	}

	async createTags(params: InsertableTag[], trx?: Trx) {
		return await this.TagRepository.createTags(params, trx)
	}

	async listTags() {
		return await this.TagRepository.getTags()
	}

	async createCommunityTags(
		params: Array<{
			tagId: string
			communityId: string
			isPrimary: boolean
		}>,
		trx?: Trx,
	) {
		return await this.TagRepository.createCommunityTags(params, trx)
	}

	async getUserInterests(userId: string, trx?: Trx) {
		return await this.TagRepository.getUserInterests(userId, trx)
	}

	async upsertUserInterests(
		params: { tagIds: string[]; userId: string },
		trx?: Trx,
	) {
		return await this.TagRepository.upsertUserInterests(params, trx)
	}
}
