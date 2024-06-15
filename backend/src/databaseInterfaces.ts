export interface UserSettingsInterface {
    usersettingsid?: number;
    token: string;
    isvalidatedtoken: boolean;
    firstname: string;
    lastname: string;
    email: string;
    pass_word: string;
}
//SIGNUP | SIGNIN
//Signup -> asked to fill usersettings table. Then redirected to userprofile table to fill.