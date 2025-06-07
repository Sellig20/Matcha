// src/models/userPicture.model.ts
import { InferEntity, InferInput } from "../orm/schemaTypes";
import { ReadOptions, ORM } from "../orm/orm"

export class UserPictureModel {
	private orm: ORM;

	constructor(orm: ORM) {
		this.orm = orm;
	}

	/**
	 * Creates a new user picture.
	 * If 'is_profile_picture' is true, it attempts to set other profile pictures for the user to false.
	 * Note: This logic should ideally be handled with a database partial unique index or a transaction
	 * managed at a higher service layer for atomicity.
	 * @param data - Data for the new picture.
	 * @returns The created user_picture entity or null if creation failed.
	 */
	async create(
		data: InferInput<"user_pictures">
	): Promise<InferEntity<"user_pictures"> | null> {
		if (data.is_profile_picture) {
			try {
				const existingProfilePics = await this.orm.read<"user_pictures">(
					"user_pictures",
					{
						where: {
							user_id: data.user_id,
							is_profile_picture: true,
						},
					}
				);
				for (const pic of existingProfilePics) {
					if (pic.id) {
						await this.orm.update<"user_pictures">("user_pictures", pic.id, {
							is_profile_picture: false,
						});
					}
				}
			} catch (e) {
				console.error("Error clearing existing profile pictures:", e);
				return null;
			}
		}
		return this.orm.create<"user_pictures">("user_pictures", data);
	}

	/**
	 * Finds a user picture by its ID.
	 * @param id - The ID of the picture.
	 * @returns The user_picture entity or null if not found.
	 */
	async findById(id: number): Promise<InferEntity<"user_pictures"> | null> {
		return this.orm.readById<"user_pictures">("user_pictures", id);
	}

	/**
	 * Finds all pictures for a given user.
	 * @param userId - The ID of the user.
	 * @param options - Optional query options.
	 * @returns An array of user_picture entities.
	 */
	async findByUserId(
		userId: number,
		options?: ReadOptions<"user_pictures">
	): Promise<InferEntity<"user_pictures">[]> {
		const defaultOptions: ReadOptions<"user_pictures"> = {
			where: { user_id: userId },
			orderBy: { field: "created_at", direction: "ASC" },
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"user_pictures">("user_pictures", queryOptions);
	}

	/**
	 * Retrieves the designated profile picture for a user.
	 * @param userId - The ID of the user.
	 * @returns The profile picture entity or null if none is set.
	 */
	async getUserProfilePicture(
		userId: number
	): Promise<InferEntity<"user_pictures"> | null> {
		return this.orm.findOne<"user_pictures">("user_pictures", {
			where: {
				user_id: userId,
				is_profile_picture: true,
			},
		});
	}

	/**
	 * Updates a user picture by its ID.
	 * If 'is_profile_picture' is set to true, ensures other pictures for the user are not profile pictures.
	 * @param id - The ID of the picture to update.
	 * @param data - Partial data for the update.
	 * @returns The updated user_picture entity or null.
	 */
	async update(
		id: number,
		data: Partial<InferInput<"user_pictures">>
	): Promise<InferEntity<"user_pictures"> | null> {
		if (data.is_profile_picture === true) {
			const picToUpdate = await this.findById(id);
			if (picToUpdate && picToUpdate.user_id) {
				try {
					const existingProfilePics = await this.orm.read<"user_pictures">(
						"user_pictures",
						{
							where: {
								user_id: picToUpdate.user_id,
								is_profile_picture: true,
							},
						}
					);
					for (const pic of existingProfilePics) {
						if (pic.id && pic.id !== id) {
							await this.orm.update<"user_pictures">("user_pictures", pic.id, {
								is_profile_picture: false,
							});
						}
					}
				} catch (e) {
					console.error(
						"Error clearing existing profile pictures during update:",
						e
					);
					return null;
				}
			}
		}
		return this.orm.update<"user_pictures">("user_pictures", id, data);
	}

	/**
	 * Deletes a user picture by its ID.
	 * @param id - The ID of the picture to delete.
	 * @returns True if deletion was successful, false otherwise.
	 */
	async delete(id: number): Promise<boolean> {
		return this.orm.delete<"user_pictures">("user_pictures", id);
	}
}
