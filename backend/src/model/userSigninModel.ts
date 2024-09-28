import { query } from '../db';
import bcrypt from 'bcryptjs';
import orm from '../../index';
import { UserCreate } from '../orm/schema';

export class userSigninModel {
    static async getLogin(email: string, password: string) {
        // const resEmail = await query('SELECT * FROM public.usersettings WHERE email = $1', [email]);
        const userArray = await orm?.read<"users", any>("users", "email", email);
        console.log("\n\n =>>>>> response signin model====> ", userArray);
        const user = userArray ? userArray[0] : null;
        if (user && user.email.length === 0) {
            throw new Error('Wrong email');
        }
        // const myUser = resEmail.rows[0];
        const myUser = "";
        const hashedPwd = user.password_hash;
        console.log("\n\n\n password = ", password);
        console.log("\n\n\n user.password_hash = ", user.password_hash);
        const resPassword = await bcrypt.compare(password, hashedPwd);
        if (!resPassword) {
            throw new Error('Wrong password');
        }
        // delete myUser.pass_word;
        return user;
    }

    static async storeNewToken(email: string, validation_token: string, id: number) {
        // await query('UPDATE public.usersettings SET validationtoken = $1 WHERE email = $2', [token, email]);
        const tokenObj = { validation_token };
        const response = await orm?.update<"users">("users", id, tokenObj);
        return response;
    }
}