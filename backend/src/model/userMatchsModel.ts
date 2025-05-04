import orm from '../../server'
import { UsersMatchsCreate } from '../orm/schema';

export class userMatchsModel {
    static async createMatchs(newMatchs: UsersMatchsCreate) {
        const res = await orm?.create<"users_matchs">("users_matchs", newMatchs)
        return res;
    }

    static async readMatchs(key?: string, value?: string | number) {
        const res = await orm?.read<"users_matchs">("users_matchs", key, value)
        return res;
    }

    static async updateMatchs(id: number, updateData: Partial<UsersMatchsCreate>) {
        const res = await orm?.update<"users_matchs">("users_matchs", id, updateData)
        return res;
    }

    static async deleteMatchs(id: number) {
        const res = await orm?.delete<"users_matchs">("users_matchs", id)
        return res;
    }
}