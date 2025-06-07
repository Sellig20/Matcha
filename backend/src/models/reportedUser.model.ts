// src/models/reportedUser.model.ts
import { InferEntity, InferInput } from "../orm/schemaTypes";
import { ReadOptions, ORM } from "../orm/orm";

export class ReportedUserModel {
	private orm: ORM;

	constructor(orm: ORM) {
		this.orm = orm;
	}

	/**
	 * Creates a new user report record. 'reported_at' is handled by DB default.
	 * Prevents self-reporting and relies on DB unique constraint for duplicate reports by the same reporter.
	 * @param data - Must include reporter_id, reported_id, and optionally a reason.
	 * @returns The created reported_user entity or null if creation failed.
	 */
	async create(
		data: InferInput<"reported_users">
	): Promise<InferEntity<"reported_users"> | null> {
		if (data.reporter_id === data.reported_id) {
			console.warn("User cannot report themselves.");
			return null;
		}
		return this.orm.create<"reported_users">("reported_users", data);
	}

	/**
	 * Finds a report record by its ID.
	 * @param id - The ID of the report.
	 * @returns The reported_user entity or null if not found.
	 */
	async findById(id: number): Promise<InferEntity<"reported_users"> | null> {
		return this.orm.readById<"reported_users">("reported_users", id);
	}

	/**
	 * Finds a specific report made by a reporter against a reported user.
	 * @param reporterId - The ID of the user who made the report.
	 * @param reportedId - The ID of the user who was reported.
	 * @returns The reported_user entity or null if no such report exists.
	 */
	async findSpecificReport(
		reporterId: number,
		reportedId: number
	): Promise<InferEntity<"reported_users"> | null> {
		return this.orm.findOne<"reported_users">("reported_users", {
			where: {
				reporter_id: reporterId,
				reported_id: reportedId,
			},
		});
	}

	/**
	 * Retrieves all reports made by a specific user.
	 * @param reporterId - The ID of the user who made the reports.
	 * @param options - Optional query options.
	 * @returns An array of reported_user entities.
	 */
	async getReportsMadeByUser(
		reporterId: number,
		options?: ReadOptions<"reported_users">
	): Promise<InferEntity<"reported_users">[]> {
		const defaultOptions: ReadOptions<"reported_users"> = {
			where: { reporter_id: reporterId },
			orderBy: { field: "reported_at", direction: "DESC" },
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"reported_users">("reported_users", queryOptions);
	}

	/**
	 * Retrieves all reports made against a specific user.
	 * @param reportedId - The ID of the user who was reported.
	 * @param options - Optional query options.
	 * @returns An array of reported_user entities.
	 */
	async getReportsAgainstUser(
		reportedId: number,
		options?: ReadOptions<"reported_users">
	): Promise<InferEntity<"reported_users">[]> {
		const defaultOptions: ReadOptions<"reported_users"> = {
			where: { reported_id: reportedId },
			orderBy: { field: "reported_at", direction: "DESC" },
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"reported_users">("reported_users", queryOptions);
	}

	/**
	 * Deletes a report by its ID. This might be an admin-only action.
	 * @param id - The ID of the report to delete.
	 * @returns True if deletion was successful, false otherwise.
	 */
	async delete(id: number): Promise<boolean> {
		return this.orm.delete<"reported_users">("reported_users", id);
	}
}
