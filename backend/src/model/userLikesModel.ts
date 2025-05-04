import orm from '../../server'
import { UsersLikesCreate } from '../orm/schema';

export class userLikesModel {
    static async createLikes(newLikes: UsersLikesCreate) {
        const res = await orm?.create<"users_likes">("users_likes", newLikes)
        return res;
    }

    static async readLikes(key?: string, value?: string | number) {
        const res = await orm?.read<"users_likes", string>("users_likes", key, value)
        return res;
    }

    static async updateLikes(id: number, updateData: Partial<UsersLikesCreate>) {
        const res = await orm?.update<"users_likes">("users_likes", id, updateData)
        return res;
    }

    static async deleteLikes(id: number) {
        const res = await orm?.delete<"users_likes">("users_likes", id)
        return res;
    }
}