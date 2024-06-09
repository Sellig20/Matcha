export interface UserSettingsInterface {
    usersettingsid: number;
    userprofileid: number;
    validationtoken: number;
    isvalidatedtoken: boolean;
    firstname: string;
    lastname: string;
    email: string;
    pass_word: string;
}

export interface UserSettingsArray {
    users: UserSettingsInterface[];
}