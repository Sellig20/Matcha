import orm from '../../server'
import { UserCreate } from '../orm/schema';

export class userModel {
    static async createUser(newUser: UserCreate) {
        const res = await orm?.create<"users">("users", newUser)
        return res;
    }

    static async readUser(key?: string, value?: string | number) {
        const res = await orm?.read<"users">("users", key, value)
        return res;
    }

    static async updateUser(id: number, updateData: Partial<UserCreate>) {
        const res = await orm?.update<"users">("users", id, updateData)
        return res;
    }

    static async deleteUser(id: number) {
        const res = await orm?.delete<"users">("users", id)
        return res;
    }
}