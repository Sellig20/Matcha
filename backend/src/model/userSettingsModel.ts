import orm from '../../index';
export class userSettingsModel {
    static async getAllUsers() {
        const key = "users";
        const value = "*";
        const response = await orm?.read<"users", any>("users", key, value);
    }
}