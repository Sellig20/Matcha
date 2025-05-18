// src/models/userTag.model.ts
import { InferEntity, InferInput, AppTable } from "../orm/schemaTypes"; // Adjust path as needed
import { ReadOptions, ORM } from "../orm/orm"; // Assuming ReadOptions is exported

export class UserTagModel {
	private orm: ORM;

	constructor(orm: ORM) {
		this.orm = orm;
	}

	/**
	 * Assigns a tag to a user. Creates a record in the user_tags join table.
	 * 'assigned_at' is handled by DB default.
	 * @param data - Must include user_id and tag_id.
	 * @returns The created user_tag entity or null if creation failed.
	 */
	async assignTagToUser(
		data: InferInput<"user_tags">
	): Promise<InferEntity<"user_tags"> | null> {
		return this.orm.create<"user_tags">("user_tags", data);
	}

	/**
	 * Finds all tag assignments for a given user.
	 * @param userId - The ID of the user.
	 * @param options - Optional query options.
	 * @returns An array of user_tag entities.
	 */
	async findTagsByUserId(
		userId: number,
		options?: ReadOptions<"user_tags">
	): Promise<InferEntity<"user_tags">[]> {
		const defaultOptions: ReadOptions<"user_tags"> = {
			where: { user_id: userId } as Partial<InferEntity<"user_tags">>,
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"user_tags">("user_tags", queryOptions);
	}

	/**
	 * Finds all users associated with a given tag.
	 * @param tagId - The ID of the tag.
	 * @param options - Optional query options.
	 * @returns An array of user_tag entities.
	 */
	async findUsersByTagId(
		tagId: number,
		options?: ReadOptions<"user_tags">
	): Promise<InferEntity<"user_tags">[]> {
		const defaultOptions: ReadOptions<"user_tags"> = {
			where: { tag_id: tagId } as Partial<InferEntity<"user_tags">>,
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"user_tags">("user_tags", queryOptions);
	}

	/**
	 * Finds a specific user-tag assignment.
	 * @param userId - The ID of the user.
	 * @param tagId - The ID of the tag.
	 * @returns The user_tag entity or null if not found.
	 */
	async findUserTag(
		userId: number,
		tagId: number
	): Promise<InferEntity<"user_tags"> | null> {
		return this.orm.findOne<"user_tags">("user_tags", {
			where: { user_id: userId, tag_id: tagId } as Partial<
				InferEntity<"user_tags">
			>,
		});
	}

	/**
	 * Removes a tag assignment from a user using a custom query for composite primary key.
	 * @param userId - The ID of the user.
	 * @param tagId - The ID of the tag.
	 * @returns True if deletion was successful (at least one row affected), false otherwise.
	 */
	async removeTagFromUser(userId: number, tagId: number): Promise<boolean> {
		const queryText = `DELETE FROM public."user_tags" WHERE "user_id" = $1 AND "tag_id" = $2`;
		try {
			const result = await this.orm.customQuery(queryText, [userId, tagId]);
			return (result.rowCount ?? 0) > 0;
		} catch (error) {
			console.error(
				`Error removing tag (tag_id: ${tagId}) from user (user_id: ${userId}):`,
				error
			);
			return false;
		}
	}
}
