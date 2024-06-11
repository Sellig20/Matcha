import { query } from '../db';
import bcrypt from 'bcryptjs';
export class userLoginModel {
    static async getLogin(email: string, password: string) {
        const resEmail = await query('SELECT email FROM public.usersettings WHERE email = $1', [email]);
        if (resEmail.rows && resEmail.rows.length === 0) {
            throw new Error('Wrong email');
        }
        const myUser = resEmail.rows[0];
        const hashedPwd = myUser.password;
        console.log("passwoooooooooord ===============> ", password);
        console.log("la comparaison =================> ", myUser);
        console.log("hashedPWD =================> ", hashedPwd);
        const resPassword = await bcrypt.compare(password, resEmail.rows[0].user);
        console.log("---------> ", resPassword);
        return resEmail.rows;
    }
}