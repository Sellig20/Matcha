export interface UserSettingsInterface {
    usersettingsid?: number;
    token: string;
    isvalidatedtoken: boolean;
    firstname: string;
    lastname: string;
    email: string;
    pass_word: string;
}

export enum genderEnum {
    female = "female",
    nonBinary = "non-binary",
    male = 'male'
}

export enum sexualInterestEnum {
    women = "women",
    men = "men",
    both = "both",
    notSpecified = "not-specified"
}

export enum tagsEnum {
    vegetarian = "vegetarian", 
    vegan = "vegan", 
    tattoo = "tattoo", 
    piercing = "piercing", 
    gamer = "gamer", 
    geek = "geek", 
    karaoke = "karaoke", 
    sport = "sport", 
    karate = "karate", 
    badminton = "badminton", 
    running = "running", 
    boxing = "boxing", 
    hike = "hike", 
    football = "football", 
    fitness = "fitness", 
    food = "food",
    rowing = "rowing",
    travel = "travel", 
    art = "art", 
    music = "music", 
    guitare = "guitare", 
    saxophone = "saxophone", 
    painting = "painting", 
    concert = "concert", 
    danse = "danse", 
    cinema = "cinema", 
    yoga = "yoga"
}
export interface UserProfileInterface {
    // userprofileid?: number;
    // usersettingsid: number;
    // username: string;
    // age: number;
    // gender : genderEnum;
    // sexual_interest : sexualInterestEnum;
    // biography: string;
    // tags_1: tagsEnum;
    // tags_2: tagsEnum;
    // tags_3: tagsEnum;
    // hasProfilePicture: boolean;
    id: number;
    userprofileid: number;
    usersettingsid: number;
    user_name: string;
    age: number;
    age_lower_bound: number;
    age_upper_bound: number;
    gender : genderEnum;
    sexual_interest : sexualInterestEnum;
    biography: string;
    tags_1: tagsEnum;
    tags_2: tagsEnum;
    tags_3: tagsEnum;
    hasProfilePicture: boolean;
    validationtoken: number;
    isvalidatedtoken: boolean;
    first_name: string;
    last_name: string;
    email: string;
    pass_word: string;
}
//SIGNUP | SIGNIN
//Signup -> asked to fill usersettings table. Then redirected to userprofile table to fill.