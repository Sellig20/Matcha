import { query } from '../db';
import bcrypt from 'bcryptjs';
import orm from '../../index';
import { UserCreate } from '../orm/schema';

export class userSigninModel {
    static async getLogin(email: string, password: string) {
        const userArray = await orm?.read<"users", any>("users", "email", email);
        const user = userArray ? userArray[0] : null;
        if (user && user.email.length === 0) {
            throw new Error('Wrong email');
        }
        const myUser = "";
        const hashedPwd = user.password_hash;
        const resPassword = await bcrypt.compare(password, hashedPwd);
        if (!resPassword) {
            throw new Error('Wrong password');
        }
        // delete myUser.pass_word;
        return user;
    }

    static async storeNewToken(email: string, validation_token: string, id: number) {
        const tokenObj = { validation_token };
        const response = await orm?.update<"users">("users", id, tokenObj);
        return response;
    }
}