// src/models/blockedUser.model.ts
import { InferEntity, InferInput } from "../orm/schemaTypes";
import { ReadOptions, ORM } from "../orm/orm";

export class BlockedUserModel {
	private orm: ORM;

	constructor(orm: ORM) {
		this.orm = orm;
	}

	/**
	 * Creates a new block record. 'blocked_at' is handled by DB default.
	 * Prevents self-blocking and relies on DB unique constraint for duplicate prevention.
	 * @param data - Must include blocker_id and blocked_id.
	 * @returns The created blocked_user entity or null if creation failed.
	 */
	async create(
		data: InferInput<"blocked_users">
	): Promise<InferEntity<"blocked_users"> | null> {
		if (data.blocker_id === data.blocked_id) {
			console.warn("User cannot block themselves.");
			return null;
		}
		return this.orm.create<"blocked_users">("blocked_users", data);
	}

	/**
	 * Finds a block record by its ID.
	 * @param id - The ID of the block record.
	 * @returns The blocked_user entity or null if not found.
	 */
	async findById(id: number): Promise<InferEntity<"blocked_users"> | null> {
		return this.orm.readById<"blocked_users">("blocked_users", id);
	}

	/**
	 * Finds a specific block record between two users.
	 * @param blockerId - The ID of the user who initiated the block.
	 * @param blockedId - The ID of the user who was blocked.
	 * @returns The blocked_user entity or null if no such block exists.
	 */
	async findSpecificBlock(
		blockerId: number,
		blockedId: number
	): Promise<InferEntity<"blocked_users"> | null> {
		return this.orm.findOne<"blocked_users">("blocked_users", {
			where: {
				blocker_id: blockerId,
				blocked_id: blockedId,
			},
		});
	}

	/**
	 * Retrieves a list of users blocked by a specific user.
	 * @param blockerId - The ID of the user who initiated the blocks.
	 * @param options - Optional query options.
	 * @returns An array of blocked_user entities.
	 */
	async getBlockedUsersBy(
		blockerId: number,
		options?: ReadOptions<"blocked_users">
	): Promise<InferEntity<"blocked_users">[]> {
		const defaultOptions: ReadOptions<"blocked_users"> = {
			where: { blocker_id: blockerId },
			orderBy: { field: "blocked_at", direction: "DESC" },
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"blocked_users">("blocked_users", queryOptions);
	}

	/**
	 * Retrieves a list of users who have blocked a specific user.
	 * @param blockedId - The ID of the user who has been blocked.
	 * @param options - Optional query options.
	 * @returns An array of blocked_user entities.
	 */
	async getBlockersOfUser(
		blockedId: number,
		options?: ReadOptions<"blocked_users">
	): Promise<InferEntity<"blocked_users">[]> {
		const defaultOptions: ReadOptions<"blocked_users"> = {
			where: { blocked_id: blockedId },
			orderBy: { field: "blocked_at", direction: "DESC" },
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"blocked_users">("blocked_users", queryOptions);
	}

	/**
	 * Deletes a block record by its ID (unblock action).
	 * @param id - The ID of the block record to delete.
	 * @returns True if deletion was successful, false otherwise.
	 */
	async delete(id: number): Promise<boolean> {
		return this.orm.delete<"blocked_users">("blocked_users", id);
	}

	/**
	 * Deletes a specific block between two users (unblock action).
	 * @param blockerId - The ID of the user who initiated the block.
	 * @param blockedId - The ID of the user who was blocked.
	 * @returns True if deletion was successful, false otherwise.
	 */
	async deleteSpecificBlock(
		blockerId: number,
		blockedId: number
	): Promise<boolean> {
		const block = await this.findSpecificBlock(blockerId, blockedId);
		if (block && block.id) {
			return this.orm.delete<"blocked_users">("blocked_users", block.id);
		}
		return false;
	}
}
