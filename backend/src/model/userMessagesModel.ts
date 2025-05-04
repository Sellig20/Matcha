import orm from '../../server'
import { UsersMessagesCreate } from '../orm/schema';

export class userMessagesModel {
    static async createMessages(newMessages: UsersMessagesCreate) {
        const res = await orm?.create<"users_messages">("users_messages", newMessages)
        return res;
    }

    static async readMessages(key?: string, value?: string | number) {
        const res = await orm?.read<"users_messages", string>("users_messages", key, value)
        return res;
    }

    static async updateMessages(id: number, updateData: Partial<UsersMessagesCreate>) {
        const res = await orm?.update<"users_messages">("users_messages", id, updateData)
        return res;
    }

    static async deleteMessages(id: number) {
        const res = await orm?.delete<"users_messages">("users_messages", id)
        return res;
    }
}