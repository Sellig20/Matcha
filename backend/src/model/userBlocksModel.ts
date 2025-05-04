import orm from '../../server'
import { UsersBlocksCreate } from '../orm/schema';

export class userBlocksModel {
    static async createBlocks(newBlocks: UsersBlocksCreate) {
        const res = await orm?.create<"users_blocks">("users_blocks", newBlocks)
        return res;
    }

    static async readBlocks(key?: string, value?: string | number) {
        const res = await orm?.read<"users_blocks">("users_blocks", key, value)
        return res;
    }

    static async updateBlocks(id: number, updateData: Partial<UsersBlocksCreate>) {
        const res = await orm?.update<"users_blocks">("users_blocks", id, updateData)
        return res;
    }

    static async deleteBlocks(id: number) {
        const res = await orm?.delete<"users_blocks">("users_blocks", id)
        return res;
    }
}