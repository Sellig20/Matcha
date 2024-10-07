import { query } from '../db';
import { UserSettingsInterface } from '../databaseInterfaces';
import orm from '../../index'
import { UserCreate } from '../orm/schema';

// export class userSignupModel {
//     static async findByEmail(email: string) {
// //         const res = await query('SELECT * FROM public.usersettings WHERE email = $1', [email]);
// //         return res.rows.length > 0 ? res.rows[0] : null;
//     }

//     static async createNewUser(newUser: UserSettingsInterface) {
//             const res = await query('INSERT INTO public.usersettings (validationtoken, isvalidatedtoken, firstname, lastname, email, pass_word) VALUES ($1, $2, $3, $4, $5, $6) RETURNING usersettingsid', 
//             [newUser.token, newUser.isvalidatedtoken, newUser.firstname, newUser.lastname, newUser.email, newUser.pass_word]
//         );
//         return res.rows[0].usersettingsid;
//     }

//     static async addTokenInBdd(validationToken: string, email: string) {
//         await query('UPDATE public.usersettings SET validationtoken = $1 WHERE email = $2', [validationToken, email]);
//     }
// }

export class userSignupModel {

    static async createUser(newUser: UserCreate) {
        const response = await orm?.create<"users">("users", newUser);
        return response;
    }

    static async updateUserToken(id: number, updateData: Partial<UserCreate>) {
        console.log("\n\n\n\n ===================== \n updateData : ", updateData);
        const response = await orm?.update<"users">("users", id, updateData);
        console.log("***************************************************** ", response);
        return response;
    }

    static async readUserByEmail(key: string, value?: string | number) {
        const response = await orm?.read<"users", any>("users", key, value);
        return response;
    }

    static async deleteUser(id: number) {
        const response = await orm?.delete<"users">("users", id);
        return response;
    }

}