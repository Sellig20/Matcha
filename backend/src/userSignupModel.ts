import { query } from './db';
import { UserSettingsInterface } from './userInterface';

export class userSignupModel {
    static async findByEmail(email: string) {
        console.log("dans model signuuup");
        const res = await query('SELECT * FROM public.usersettings WHERE email = $1', [email]);
        return res.rows.length > 0 ? res.rows[0] : null;
    }

    static async createNewUser(newUser: UserSettingsInterface) {
        console.log("dans model CREATE USEEER signuuup");
        await query('INSERT INTO public.usersettings (validationToken, firstname, lastname, email, pass_word) VALUES (10, $1, $2, $3, $4)', [newUser.firstname, newUser.lastname, newUser.email, newUser.pass_word]);
    }
}