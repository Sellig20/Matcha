import orm from '../../index';
import { UserCreate } from '../orm/schema';
export class userSettingsModel {

    static async getAllUsers() {
        const key = "users";
        const value = "*";
        const response = await orm?.read<"users", any>("users", key, value);
    }

    static async updateUser(id: number, updateData: Partial<UserCreate>) {
        const response = await orm?.update<"users">("users", id, updateData);
        return response;
    }
}