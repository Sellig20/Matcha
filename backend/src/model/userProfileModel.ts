import { UserProfileInterface } from '../databaseInterfaces';
import { query } from '../db';

export class userProfileModel {
    static async displayProfile(usersettingsid: string) {
            console.log("\nuserProfileModel.ts | display profile | usersettingsid ---> ", usersettingsid);
        const res = await query('SELECT * FROM public.usersettings WHERE usersettingsid = $1', [usersettingsid]);
            console.log("\n\n\n ----> userprofilemodel.ts | res user to display : ", res, "\n\n\n")
        return res.rows[0];
    }
    
    static async createNewProfile(newProfile: UserProfileInterface) {
            console.log("\nuserProfileModele.ts | create new profile : \n", newProfile , "\n");
        const res = await query('INSERT INTO public.userprofile (usersettingsid, username, age, gender, sexualinterest, biography, tags, hasprofilepicture) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING userprofileid',
        [newProfile.usersettingsid, newProfile.username, newProfile.age, newProfile.gender, newProfile.sexualInterest, newProfile.biography, newProfile.tags, newProfile.hasProfilePicture]
        );
            console.log("\nresponse from creating a new user profile : ", res, "\n\n");
        return res.rows[0];
    }
}