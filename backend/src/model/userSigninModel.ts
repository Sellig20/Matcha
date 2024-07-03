import console from 'console';
import { query } from '../db';
import bcrypt from 'bcryptjs';

export class userSigninModel {
    static async getLogin(email: string, password: string) {
        const resEmail = await query('SELECT * FROM public.usersettings WHERE email = $1', [email]);
        if (resEmail.rows && resEmail.rows.length === 0) {
            throw new Error('Wrong email');
        }

        const myUser = resEmail.rows[0];
        // console.log("\n\n\n ici -> my user = ", myUser.pass_word);

        const hashedPwd = myUser.pass_word;

            // console.log("\n\nUserSignInModel.tsx | password ===============> ", password);
            // console.log("UserSignInModel.tsx | la comparaison =================> ", myUser);
            // console.log("UserSignInModel.tsx | hashedPWD =================> ", hashedPwd);

        const resPassword = await bcrypt.compare(password, hashedPwd);
        console.log("---------> ", resPassword);
        if (!resPassword) {
            throw new Error('Wrong password');
        }

        delete myUser.pass_word;
        return myUser;
    }

    static async storeNewToken(email: string, token: string) {
            // console.log("userSigninModel.ts | store new token");
        await query('UPDATE public.usersettings SET validationtoken = $1 WHERE email = $2', [token, email]);
    }
}