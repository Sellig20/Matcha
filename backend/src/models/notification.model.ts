// src/models/notification.model.ts
import { InferEntity, InferInput } from "../orm/schemaTypes"; // Adjust path as needed
import { ReadOptions, ORM } from "../orm/orm"; // Assuming ReadOptions is exported

export class NotificationModel {
	private orm: ORM;

	constructor(orm: ORM) {
		this.orm = orm;
	}

	/**
	 * Creates a new notification. 'created_at' is handled by DB default.
	 * @param data - Data for the new notification.
	 * @returns The created notification entity or null if creation failed.
	 */
	async create(
		data: InferInput<"notifications">
	): Promise<InferEntity<"notifications"> | null> {
		return this.orm.create<"notifications">("notifications", data);
	}

	/**
	 * Finds a notification by its ID.
	 * @param id - The ID of the notification.
	 * @returns The notification entity or null if not found.
	 */
	async findById(id: number): Promise<InferEntity<"notifications"> | null> {
		return this.orm.readById<"notifications">("notifications", id);
	}

	/**
	 * Finds all notifications for a specific user.
	 * @param userId - The ID of the user.
	 * @param options - Optional query options.
	 * @returns An array of notification entities.
	 */
	async findNotificationsForUser(
		userId: number,
		options?: ReadOptions<"notifications">
	): Promise<InferEntity<"notifications">[]> {
		const defaultOptions: ReadOptions<"notifications"> = {
			where: { user_id: userId } as Partial<InferEntity<"notifications">>,
			orderBy: { field: "created_at", direction: "DESC" },
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"notifications">("notifications", queryOptions);
	}

	/**
	 * Finds all unread notifications for a specific user.
	 * @param userId - The ID of the user.
	 * @param options - Optional query options.
	 * @returns An array of unread notification entities.
	 */
	async findUnreadNotificationsForUser(
		userId: number,
		options?: ReadOptions<"notifications">
	): Promise<InferEntity<"notifications">[]> {
		const defaultOptions: ReadOptions<"notifications"> = {
			where: {
				user_id: userId,
				is_read: false,
			} as Partial<InferEntity<"notifications">>,
			orderBy: { field: "created_at", direction: "DESC" },
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"notifications">("notifications", queryOptions);
	}

	/**
	 * Marks a specific notification as read.
	 * @param notificationId - The ID of the notification.
	 * @returns The updated notification entity or null.
	 */
	async markAsRead(
		notificationId: number
	): Promise<InferEntity<"notifications"> | null> {
		return this.orm.update<"notifications">("notifications", notificationId, {
			is_read: true,
		});
	}

	/**
	 * Marks all unread notifications for a specific user as read.
	 * @param userId - The ID of the user.
	 * @returns The number of notifications updated.
	 */
	async markAllAsReadForUser(userId: number): Promise<number> {
		const queryText = `
            UPDATE public."notifications" 
            SET "is_read" = TRUE 
            WHERE "user_id" = $1 AND "is_read" = FALSE
        `;
		try {
			const result = await this.orm.customQuery(queryText, [userId]);
			return result.rowCount ?? 0;
		} catch (error) {
			console.error(
				`Error marking all notifications as read for user ${userId}:`,
				error
			);
			return 0;
		}
	}

	/**
	 * Deletes a notification by its ID.
	 * @param id - The ID of the notification to delete.
	 * @returns True if deletion was successful, false otherwise.
	 */
	async delete(id: number): Promise<boolean> {
		return this.orm.delete<"notifications">("notifications", id);
	}

	/**
	 * Deletes all notifications for a specific user.
	 * @param userId - The ID of the user.
	 * @returns The number of notifications deleted.
	 */
	async deleteAllForUser(userId: number): Promise<number> {
		const queryText = `DELETE FROM public."notifications" WHERE "user_id" = $1`;
		try {
			const result = await this.orm.customQuery(queryText, [userId]);
			return result.rowCount ?? 0;
		} catch (error) {
			console.error(
				`Error deleting all notifications for user ${userId}:`,
				error
			);
			return 0;
		}
	}
}
