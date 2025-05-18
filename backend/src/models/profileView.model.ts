// src/models/profileView.model.ts
import { InferEntity, InferInput } from "../orm/schemaTypes"; // Adjust path as needed
import { ReadOptions, ORM } from "../orm/orm"; // Assuming ReadOptions is exported

export class ProfileViewModel {
	private orm: ORM;

	constructor(orm: ORM) {
		this.orm = orm;
	}

	/**
	 * Records a profile view. 'viewed_at' is handled by the database default.
	 * Prevents users from recording views on their own profile.
	 * @param data - Must include viewer_id and viewed_id.
	 * @returns The created profile_view entity or null if creation failed (e.g., self-view).
	 */
	async create(
		data: InferInput<"profile_views">
	): Promise<InferEntity<"profile_views"> | null> {
		if (data.viewer_id === data.viewed_id) {
			console.warn("User cannot record a view on their own profile.");
			return null;
		}
		return this.orm.create<"profile_views">("profile_views", data);
	}

	/**
	 * Finds a profile view record by its ID.
	 * @param id - The ID of the profile view.
	 * @returns The profile_view entity or null if not found.
	 */
	async findById(id: number): Promise<InferEntity<"profile_views"> | null> {
		return this.orm.readById<"profile_views">("profile_views", id);
	}

	/**
	 * Finds all views recorded for a specific user's profile (who was viewed).
	 * @param viewedId - The ID of the user whose profile was viewed.
	 * @param options - Optional query options.
	 * @returns An array of profile_view entities.
	 */
	async findViewsOfUser(
		viewedId: number,
		options?: ReadOptions<"profile_views">
	): Promise<InferEntity<"profile_views">[]> {
		const defaultOptions: ReadOptions<"profile_views"> = {
			where: { viewed_id: viewedId } as Partial<InferEntity<"profile_views">>,
			orderBy: { field: "viewed_at", direction: "DESC" },
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"profile_views">("profile_views", queryOptions);
	}

	/**
	 * Finds all profiles a specific user has viewed.
	 * @param viewerId - The ID of the user who viewed profiles.
	 * @param options - Optional query options.
	 * @returns An array of profile_view entities.
	 */
	async findViewsByUser(
		viewerId: number,
		options?: ReadOptions<"profile_views">
	): Promise<InferEntity<"profile_views">[]> {
		const defaultOptions: ReadOptions<"profile_views"> = {
			where: { viewer_id: viewerId } as Partial<InferEntity<"profile_views">>,
			orderBy: { field: "viewed_at", direction: "DESC" },
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"profile_views">("profile_views", queryOptions);
	}

	/**
	 * Deletes a profile view record by its ID.
	 * @param id - The ID of the profile view to delete.
	 * @returns True if deletion was successful, false otherwise.
	 */
	async delete(id: number): Promise<boolean> {
		return this.orm.delete<"profile_views">("profile_views", id);
	}
}
