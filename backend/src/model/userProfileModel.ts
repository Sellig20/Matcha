import { UserProfileInterface } from '../databaseInterfaces';
import orm from '../../index';
import { query } from '../db';
import { UserCreate } from '../orm/schema';

export class userProfileModel {
    static async getUserIdProfile(usersettingsid: string, key: string, value?: string | number) {
        // const res = await query('SELECT * FROM public.usersettings WHERE usersettingsid = $1', [usersettingsid]);
        // return res.rows[0];
        const response = await orm?.read<"users", any>("users", key, value);
        return response;
    }

    static async displayProfile(key: string, value?: string | number) {
        // const res = await query('SELECT * FROM public.userprofile WHERE usersettingsid = $1', [userId]);
        // return res.rows[0];
        const response = await orm?.read<"users", any>("users", key, value);
        return response;
    }
    
    static async createNewProfile(newUser: UserCreate) {
        // const res = await query('INSERT INTO public.userprofile (usersettingsid, username, age, gender, sexualinterest, biography, tags, hasprofilepicture) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING userprofileid',
        // [newProfile.usersettingsid, newProfile.username, newProfile.age, newProfile.gender, newProfile.sexualInterest, newProfile.biography, newProfile.tags, newProfile.hasProfilePicture]
        // );
        // return res.rows[0];
        const response = await orm?.create<"users">("users", newUser);
        return response;
    }
}