import { query } from '../db';
import { UserSettingsInterface } from '../databaseInterfaces';

export class userSignupModel {
    static async findByEmail(email: string) {
        console.log("dans model signuuup");
        const res = await query('SELECT * FROM public.usersettings WHERE email = $1', [email]);
        return res.rows.length > 0 ? res.rows[0] : null;
    }

    static async createNewUser(newUser: UserSettingsInterface) {
        console.log("dans model CREATE USEEER signuuup");
            const res = await query('INSERT INTO public.usersettings (validationtoken, isvalidatedtoken, firstname, lastname, email, pass_word) VALUES ($1, $2, $3, $4, $5, $6) RETURNING usersettingsid', 
            [newUser.token, newUser.isvalidatedtoken, newUser.firstname, newUser.lastname, newUser.email, newUser.pass_word]
        );
        return res.rows[0].usersettingsid;
    }

    static async addTokenInBdd(validationToken: string, email: string) {
        console.log("adding token in bdd signup model");
        await query('UPDATE public.usersettings SET validationtoken = $1 WHERE email = $2', [validationToken, email]);
    }
}