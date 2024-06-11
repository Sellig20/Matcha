import { query } from './db';
//dans le model on fait une injection direct a la bdd
export class userSettingsModel {
    static async getAllUsers() {
        const res = await query('SELECT * FROM public.usersettings');
        return res.rows;
    }

    // static async getUserById(userId: number) {
    //     // console.log("DANS LE MODELLLLLLLL");
    //     // console.log("user id dans le model => ", userId);
    //     const res = await query('SELECT * FROM public.usersettings WHERE userprofileid = $1', [userId]);
    //     return res.rows;
    // }
}