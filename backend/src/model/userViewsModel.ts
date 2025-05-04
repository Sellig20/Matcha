import orm from '../../server'
import { UsersViewsCreate } from '../orm/schema';

export class userViewsModel {
    static async createView(newView: UsersViewsCreate) {
        const res = await orm?.create<"users_views">("users_views", newView)
        return res;
    }

    static async readView(key?: string, value?: string | number) {
        const res = await orm?.read<"users_views", string>("users_views", key, value)
        return res;
    }

    static async updateView(id: number, updateData: Partial<UsersViewsCreate>) {
        const res = await orm?.update<"users_views">("users_views", id, updateData)
        return res;
    }

    static async deleteView(id: number) {
        const res = await orm?.delete<"users_views">("users_views", id)
        return res;
    }

}