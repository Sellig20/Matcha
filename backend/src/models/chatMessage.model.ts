// src/models/chatMessage.model.ts
import { InferEntity, InferInput } from "../orm/schemaTypes"; // Adjust path as needed
import { ReadOptions, ORM } from "../orm/orm"; // Assuming ReadOptions is exported

export class ChatMessageModel {
	private orm: ORM;

	constructor(orm: ORM) {
		this.orm = orm;
	}

	/**
	 * Creates a new chat message. 'sent_at' is handled by DB default.
	 * @param data - Must include connection_id, sender_id, receiver_id, and message_text.
	 * @returns The created chat_message entity or null if creation failed.
	 */
	async create(
		data: InferInput<"chat_messages">
	): Promise<InferEntity<"chat_messages"> | null> {
		return this.orm.create<"chat_messages">("chat_messages", data);
	}

	/**
	 * Finds a chat message by its ID.
	 * @param id - The ID of the chat message (can be a large number).
	 * @returns The chat_message entity or null if not found.
	 */
	async findById(id: number): Promise<InferEntity<"chat_messages"> | null> {
		return this.orm.readById<"chat_messages">("chat_messages", id);
	}

	/**
	 * Finds all messages for a specific connection.
	 * @param connectionId - The ID of the connection.
	 * @param options - Optional query options (e.g., pagination, order).
	 * @returns An array of chat_message entities.
	 */
	async findMessagesForConnection(
		connectionId: number,
		options?: ReadOptions<"chat_messages">
	): Promise<InferEntity<"chat_messages">[]> {
		const defaultOptions: ReadOptions<"chat_messages"> = {
			where: { connection_id: connectionId } as Partial<
				InferEntity<"chat_messages">
			>,
			orderBy: { field: "sent_at", direction: "ASC" },
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"chat_messages">("chat_messages", queryOptions);
	}

	/**
	 * Finds all unread messages for a specific user within a given connection.
	 * @param connectionId - The ID of the connection.
	 * @param receiverId - The ID of the user who is the receiver.
	 * @param options - Optional query options.
	 * @returns An array of unread chat_message entities.
	 */
	async findUnreadMessagesForUserInConnection(
		connectionId: number,
		receiverId: number,
		options?: ReadOptions<"chat_messages">
	): Promise<InferEntity<"chat_messages">[]> {
		const defaultOptions: ReadOptions<"chat_messages"> = {
			where: {
				connection_id: connectionId,
				receiver_id: receiverId,
				read_at: null,
			} as Partial<InferEntity<"chat_messages">>,
			orderBy: { field: "sent_at", direction: "ASC" },
		};
		const queryOptions = {
			...defaultOptions,
			...options,
			where: { ...defaultOptions.where, ...options?.where },
		};
		return this.orm.read<"chat_messages">("chat_messages", queryOptions);
	}

	/**
	 * Marks a specific message as read.
	 * @param messageId - The ID of the message.
	 * @param readAt - The timestamp when the message was read (defaults to current time).
	 * @returns The updated chat_message entity or null.
	 */
	async markAsRead(
		messageId: number,
		readAt: Date = new Date()
	): Promise<InferEntity<"chat_messages"> | null> {
		return this.orm.update<"chat_messages">("chat_messages", messageId, {
			read_at: readAt,
		});
	}

	/**
	 * Marks all unread messages for a receiver in a connection as read.
	 * @param connectionId - The ID of the connection.
	 * @param receiverId - The ID of the receiver.
	 * @returns The number of messages updated.
	 */
	async markAllAsReadForReceiverInConnection(
		connectionId: number,
		receiverId: number
	): Promise<number> {
		const queryText = `
            UPDATE public."chat_messages" 
            SET "read_at" = CURRENT_TIMESTAMP 
            WHERE "connection_id" = $1 AND "receiver_id" = $2 AND "read_at" IS NULL
        `;
		try {
			const result = await this.orm.customQuery(queryText, [
				connectionId,
				receiverId,
			]);
			return result.rowCount ?? 0;
		} catch (error) {
			console.error(
				`Error marking messages as read for connection ${connectionId}, receiver ${receiverId}:`,
				error
			);
			return 0;
		}
	}

	/**
	 * Deletes a chat message by its ID.
	 * @param id - The ID of the message to delete.
	 * @returns True if deletion was successful, false otherwise.
	 */
	async delete(id: number): Promise<boolean> {
		return this.orm.delete<"chat_messages">("chat_messages", id);
	}
}
