// src/models/like.model.ts
import { InferEntity, InferInput } from "../orm/schemaTypes";
import { ReadOptions, ORM } from "../orm/orm";

export class LikeModel {
	private orm: ORM;

	constructor(orm: ORM) {
		this.orm = orm;
	}

	/**
	 * Creates a new like record. 'liked_at' is handled by DB default.
	 * Prevents self-likes and relies on DB unique constraint for duplicate prevention.
	 * @param data - Must include liker_id and liked_user_id.
	 * @returns The created like entity or null if creation failed.
	 */
	async create(
		data: InferInput<"likes">
	): Promise<InferEntity<"likes"> | null> {
		if (data.liker_id === data.liked_user_id) {
			console.warn("User cannot like their own profile.");
			return null;
		}
		return this.orm.create<"likes">("likes", data);
	}

	/**
	 * Finds a like record by its ID.
	 * @param id - The ID of the like.
	 * @returns The like entity or null if not found.
	 */
	async findById(id: number): Promise<InferEntity<"likes"> | null> {
		return this.orm.readById<"likes">("likes", id);
	}

	/**
	 * Finds all likes received by a specific user.
	 * @param likedUserId - The ID of the user who received the likes.
	 * @param options - Optional query options.
	 * @returns An array of like entities.
	 */
	async findLikesReceivedByUser(
		likedUserId: number,
		options?: ReadOptions<"likes">
	): Promise<InferEntity<"likes">[]> {
		const defaultOptions: ReadOptions<"likes"> = {
			where: { liked_user_id: likedUserId },
			orderBy: { field: "liked_at", direction: "DESC" },
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"likes">("likes", queryOptions);
	}

	/**
	 * Finds all likes given by a specific user.
	 * @param likerId - The ID of the user who gave the likes.
	 * @param options - Optional query options.
	 * @returns An array of like entities.
	 */
	async findLikesGivenByUser(
		likerId: number,
		options?: ReadOptions<"likes">
	): Promise<InferEntity<"likes">[]> {
		const defaultOptions: ReadOptions<"likes"> = {
			where: { liker_id: likerId },
			orderBy: { field: "liked_at", direction: "DESC" },
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"likes">("likes", queryOptions);
	}

	/**
	 * Finds a specific like record between two users.
	 * @param likerId - The ID of the user who gave the like.
	 * @param likedUserId - The ID of the user who received the like.
	 * @returns The like entity or null if not found.
	 */
	async findSpecificLike(
		likerId: number,
		likedUserId: number
	): Promise<InferEntity<"likes"> | null> {
		return this.orm.findOne<"likes">("likes", {
			where: {
				liker_id: likerId,
				liked_user_id: likedUserId,
			} as Partial<InferEntity<"likes">>,
		});
	}

	/**
	 * Deletes a like record by its ID (unlike action).
	 * @param id - The ID of the like to delete.
	 * @returns True if deletion was successful, false otherwise.
	 */
	async delete(id: number): Promise<boolean> {
		return this.orm.delete<"likes">("likes", id);
	}

	/**
	 * Deletes a specific like between two users (unlike action).
	 * @param likerId - The ID of the user who gave the like.
	 * @param likedUserId - The ID of the user who received the like.
	 * @returns True if deletion was successful, false otherwise.
	 */
	async deleteSpecificLike(
		likerId: number,
		likedUserId: number
	): Promise<boolean> {
		const like = await this.findSpecificLike(likerId, likedUserId);
		if (like && like.id) {
			return this.orm.delete<"likes">("likes", like.id);
		}
		return false;
	}
}
