import { query } from '../db';


export class userProfileModel {
    static async displayProfile(userId: number) {
        const res = await query('SELECT * FROM public.usersettings WHERE usersettingsid = $1', [userId]);
            console.log("\n\n\n ----> userprofilemodel.ts | resuser to display : ", res, "\n\n\n")
    }
}