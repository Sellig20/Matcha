import { UserProfileInterface } from '../databaseInterfaces';
import orm from '../../index';
import { query } from '../db';
import { UserCreate } from '../orm/schema';

export class userProfileModel {
    static async getUserIdProfile(usersettingsid: string, key: string, value?: string | number) {
        const response = await orm?.read<"users", any>("users", key, value);
        return response;
    }

    static async displayProfile(key: string, value?: string | number) {
        const response = await orm?.read<"users", any>("users", key, value);
        console.log("response model db = ", response);
        return response;
    }
    
    static async createNewProfile(newUser: UserCreate) {
        const response = await orm?.create<"users">("users", newUser);
        return response;
    }
}