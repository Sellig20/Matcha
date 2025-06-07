// src/models/connection.model.ts
import { InferEntity, InferInput } from "../orm/schemaTypes";
import { ReadOptions, ORM } from "../orm/orm";

export class ConnectionModel {
	private orm: ORM;

	constructor(orm: ORM) {
		this.orm = orm;
	}

	/**
	 * Creates a new connection (match) between two users.
	 * Ensures user1_id < user2_id for consistency and DB constraints.
	 * 'connected_at' is handled by DB default.
	 * @param data - Must include user1_id and user2_id.
	 * @returns The created connection entity or null if creation failed (e.g. self-connection, duplicate).
	 */
	async create(
		data: InferInput<"connections">
	): Promise<InferEntity<"connections"> | null> {
		const { user1_id, user2_id } = data;

		if (user1_id === user2_id) {
			console.warn("Cannot create a connection with the same user.");
			return null;
		}

		const orderedData: InferInput<"connections"> = {
			user1_id: Math.min(user1_id, user2_id),
			user2_id: Math.max(user1_id, user2_id),
		};

		return this.orm.create<"connections">("connections", orderedData);
	}

	/**
	 * Finds a connection by its ID.
	 * @param id - The ID of the connection.
	 * @returns The connection entity or null if not found.
	 */
	async findById(id: number): Promise<InferEntity<"connections"> | null> {
		return this.orm.readById<"connections">("connections", id);
	}

	/**
	 * Finds all connections for a given user.
	 * This implementation performs two queries and merges/deduplicates results.
	 * For more efficiency, consider a custom SQL query with an OR condition.
	 * @param userId - The ID of the user.
	 * @param options - Optional query options.
	 * @returns An array of connection entities.
	 */
	async findConnectionsForUser(
		userId: number,
		options?: ReadOptions<"connections">
	): Promise<InferEntity<"connections">[]> {
		const baseWhere = options?.where || {};

		const connectionsAsUser1 = await this.orm.read<"connections">(
			"connections",
			{
				...options,
				where: { ...baseWhere, user1_id: userId }
			}
		);
		const connectionsAsUser2 = await this.orm.read<"connections">(
			"connections",
			{
				...options,
				where: { ...baseWhere, user2_id: userId }
			}
		);

		const allConnections = [...connectionsAsUser1, ...connectionsAsUser2];
		const uniqueConnections = Array.from(
			new Map(allConnections.map((conn) => [conn.id, conn])).values()
		);

		return uniqueConnections;
	}

	/**
	 * Finds a specific connection between two users.
	 * @param userAId - The ID of the first user.
	 * @param userBId - The ID of the second user.
	 * @returns The connection entity or null if not found.
	 */
	async findSpecificConnection(
		userAId: number,
		userBId: number
	): Promise<InferEntity<"connections"> | null> {
		const user1_id = Math.min(userAId, userBId);
		const user2_id = Math.max(userAId, userBId);
		return this.orm.findOne<"connections">("connections", {
			where: { user1_id, user2_id },
		});
	}

	/**
	 * Deletes a connection by its ID.
	 * @param id - The ID of the connection to delete.
	 * @returns True if deletion was successful, false otherwise.
	 */
	async delete(id: number): Promise<boolean> {
		return this.orm.delete<"connections">("connections", id);
	}

	/**
	 * Deletes a specific connection between two users.
	 * @param userAId - The ID of the first user.
	 * @param userBId - The ID of the second user.
	 * @returns True if deletion was successful, false otherwise.
	 */
	async deleteConnectionBetweenUsers(
		userAId: number,
		userBId: number
	): Promise<boolean> {
		const connection = await this.findSpecificConnection(userAId, userBId);
		if (connection && connection.id) {
			return this.delete(connection.id);
		}
		return false;
	}
}
