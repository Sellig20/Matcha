import { query } from '../db';


export class userProfileModel {
    static async displayProfile(usersettingsid: string) {
        console.log("userProfileModel.ts | usersettingsid ---> ", usersettingsid);
        const res = await query('SELECT * FROM public.usersettings WHERE usersettingsid = $1', [usersettingsid]);
            console.log("\n\n\n ----> userprofilemodel.ts | res user to display : ", res, "\n\n\n")
            return res.rows[0];
        }
}