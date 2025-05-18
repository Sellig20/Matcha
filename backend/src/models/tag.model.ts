// src/models/tag.model.ts
import { InferEntity, InferInput } from "../orm/schemaTypes"; // Adjust path as needed
import { ReadOptions, ORM } from "../orm/orm"; // Assuming ReadOptions is exported

export class TagModel {
	private orm: ORM;

	constructor(orm: ORM) {
		this.orm = orm;
	}

	/**
	 * Creates a new tag.
	 * @param data - The data for the new tag (should include 'name').
	 * @returns The created tag entity or null if creation failed.
	 */
	async create(data: InferInput<"tags">): Promise<InferEntity<"tags"> | null> {
		return this.orm.create<"tags">("tags", data);
	}

	/**
	 * Finds a tag by its ID.
	 * @param id - The ID of the tag to find.
	 * @returns The tag entity or null if not found.
	 */
	async findById(id: number): Promise<InferEntity<"tags"> | null> {
		return this.orm.readById<"tags">("tags", id);
	}

	/**
	 * Finds multiple tags based on the provided options.
	 * @param options - Optional query options.
	 * @returns An array of tag entities.
	 */
	async find(options?: ReadOptions<"tags">): Promise<InferEntity<"tags">[]> {
		return this.orm.read<"tags">("tags", options);
	}

	/**
	 * Finds a single tag based on the provided options.
	 * @param options - Query options (where, orderBy, select). Limit is automatically set to 1.
	 * @returns The tag entity or null if not found.
	 */
	async findOne(
		options: Omit<ReadOptions<"tags">, "limit">
	): Promise<InferEntity<"tags"> | null> {
		return this.orm.findOne<"tags">("tags", options);
	}

	/**
	 * Updates a tag by its ID.
	 * @param id - The ID of the tag to update.
	 * @param data - The partial data to update the tag with (usually just 'name').
	 * @returns The updated tag entity or null if update failed or tag not found.
	 */
	async update(
		id: number,
		data: Partial<InferInput<"tags">>
	): Promise<InferEntity<"tags"> | null> {
		return this.orm.update<"tags">("tags", id, data);
	}

	/**
	 * Deletes a tag by its ID.
	 * (Caution: ON DELETE CASCADE in 'user_tags' will delete related assignments).
	 * @param id - The ID of the tag to delete.
	 * @returns True if deletion was successful, false otherwise.
	 */
	async delete(id: number): Promise<boolean> {
		return this.orm.delete<"tags">("tags", id);
	}

	/**
	 * Finds a tag by its name.
	 * @param name - The name of the tag.
	 * @returns The tag entity or null if not found.
	 */
	async findByName(name: string): Promise<InferEntity<"tags"> | null> {
		return this.orm.findOne<"tags">("tags", {
			where: { name } as Partial<InferEntity<"tags">>,
		});
	}

	/**
	 * Finds a tag by its name, or creates it if it doesn't exist.
	 * @param name - The name of the tag.
	 * @returns The found or newly created tag entity, or null if creation failed.
	 */
	async findOrCreate(name: string): Promise<InferEntity<"tags"> | null> {
		let tag = await this.findByName(name);
		if (!tag) {
			tag = await this.create({ name });
		}
		return tag;
	}
}
