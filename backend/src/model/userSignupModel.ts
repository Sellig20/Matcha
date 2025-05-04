import { query } from '../db';
import { UserSettingsInterface } from '../databaseInterfaces';
import orm from '../../server'
import { UserCreate, UsersLikesCreate, UsersMatchsCreate, UsersMessagesCreate, UsersViewsCreate } from '../orm/schema';

// export class userSignupModel {
    // static async findByEmail(email: string) {
    //     const res = await query('SELECT * FROM public.usersettings WHERE email = $1', [email]);
    //     return res.rows.length > 0 ? res.rows[0] : null;
    // }

    // static async createNewUser(newUser: UserSettingsInterface) {
    //         const res = await query('INSERT INTO public.usersettings (validationtoken, isvalidatedtoken, firstname, lastname, email, pass_word) VALUES ($1, $2, $3, $4, $5, $6) RETURNING usersettingsid', 
    //         [newUser.token, newUser.isvalidatedtoken, newUser.firstname, newUser.lastname, newUser.email, newUser.pass_word]
    //     );
    //     return res.rows[0].usersettingsid;
    // }

//     static async addTokenInBdd(validationToken: string, email: string) {
//         await query('UPDATE public.usersettings SET validationtoken = $1 WHERE email = $2', [validationToken, email]);
//     }
// }

export class userSignupModel {

    static async createUser(newUser: UserCreate) {
        const response = await orm?.create<"users">("users", newUser);
        return response;
    }

    static async createViews(newViews: UsersViewsCreate) {
        const response = await orm?.create<"users_views">("users_views", newViews);
        return response;
    }

    static async createLikes(newLikes: UsersLikesCreate) {
        const response = await orm?.create<"users_likes">("users_likes", newLikes);
        return response;
    }

    static async updateUserToken(id: number, updateData: Partial<UserCreate>) {
        const response = await orm?.update<"users">("users", id, updateData);
        return response;
    }

    static async readUserByEmail(key?: string, value?: string | number) {
        const response = await orm?.read<"users", any>("users", key, value);
        return response;
    }

    static async deleteUser(id: number) {
        const response = await orm?.delete<"users">("users", id);
        return response;
    }

    static async deleteLike(id: number) {
        const response = await orm?.delete<"users_likes">("users_likes", id);
        return response;
    }

    static async readAllUsers() {
        const response = await orm?.read<"users", any>("users", "first_name");
        return response;
    }

    static async readViewed(key?: string, value?: string | number) {
        const response = await orm?.read<"users_views", any>("users_views", key, value);
        return response;
    }

    static async readAnything(table: string, key?: string, value?: string | number) {
        const response = await orm?.read<typeof table, any>(table, key, value);
        return response;
    }

    static async readLikes(key?: string, value?: string | number) {
        const response = await orm?.read<"users_likes", any>("users_likes", key, value);
        return response;
    }

    static async readWhoILiked(key?: string, value?: string | number) {
        const response = await orm?.read<"users_likes", any>("users_likes", key, value);
        return response;
    }

    static async readMatchas(key?: string, value?: string | number) {
        const response = await orm?.read<"users_matchs", any>("users_matchs", key, value);
        return response;
    }

    static async readFirstName(key?: string, value?: string | number) {
        const response = await orm?.read<"users", any>("users", key, value);
        if (response) 
            return response[0].first_name;
        else
            return null;
    }

    static async createMatch(newMatch: UsersMatchsCreate) {
        const response = await orm?.create<"users_matchs">("users_matchs", newMatch);
        return response;
    }

    static async createMessage(newMessage: UsersMessagesCreate) {
        const response = await orm?.create<"users_messages">("users_messages", newMessage);
        return response;
    }

    static async readMyMessages(key?: string, value?: string | number) {
        const response = await orm?.read<"users_messages", any>("users_messages", key, value);
        return response;
    }

    
}