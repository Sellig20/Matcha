// src/models/user.model.ts
import { InferEntity, InferInput } from "../orm/schemaTypes";
import { ReadOptions, ORM } from "../orm/orm";

export class UserModel {
	private orm: ORM;

	constructor(orm: ORM) {
		this.orm = orm;
	}

	/**
	 * Creates a new user.
	 * @param data - The data for the new user.
	 * @returns The created user entity or null if creation failed.
	 */
	async create(
		data: InferInput<"users">
	): Promise<InferEntity<"users"> | null> {
		return this.orm.create<"users">("users", data);
	}

	/**
	 * Finds a user by their ID.
	 * @param id - The ID of the user to find.
	 * @returns The user entity or null if not found.
	 */
	async findById(id: number): Promise<InferEntity<"users"> | null> {
		return this.orm.readById<"users">("users", id);
	}

	/**
	 * Finds multiple users based on the provided options.
	 * @param options - Optional query options (where, orderBy, limit, offset, select).
	 * @returns An array of user entities.
	 */
	async find(options?: ReadOptions<"users">): Promise<InferEntity<"users">[]> {
		return this.orm.read<"users">("users", options);
	}

	/**
	 * Finds a single user based on the provided options.
	 * Ensures only one record is returned.
	 * @param options - Query options (where, orderBy, select). Limit is automatically set to 1.
	 * @returns The user entity or null if not found.
	 */
	async findOne(
		options: Omit<ReadOptions<"users">, "limit">
	): Promise<InferEntity<"users"> | null> {
		return this.orm.findOne<"users">("users", options);
	}

	/**
	 * Updates a user by their ID.
	 * @param id - The ID of the user to update.
	 * @param data - The partial data to update the user with.
	 * @returns The updated user entity or null if update failed or user not found.
	 */
	async update(
		id: number,
		data: Partial<InferInput<"users">>
	): Promise<InferEntity<"users"> | null> {
		return this.orm.update<"users">("users", id, data);
	}

	/**
	 * Deletes a user by their ID.
	 * @param id - The ID of the user to delete.
	 * @returns True if deletion was successful, false otherwise.
	 */
	async delete(id: number): Promise<boolean> {
		return this.orm.delete<"users">("users", id);
	}

	/**
	 * Finds a user by their email address.
	 * @param email - The email address of the user.
	 * @returns The user entity or null if not found.
	 */
	async findByEmail(email: string): Promise<InferEntity<"users"> | null> {
		return this.orm.findOne<"users">("users", {
			where: { email },
		});
	}

	/**
	 * Finds a user by their username.
	 * @param username - The username of the user.
	 * @returns The user entity or null if not found.
	 */
	async findByUsername(username: string): Promise<InferEntity<"users"> | null> {
		return this.orm.findOne<"users">("users", {
			where: { username },
		});
	}
}
