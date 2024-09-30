import { ReactNode } from "react";

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
    userprofileid: number;
    usersettingsid: number;
    user_name: string;
    age: number;
    gender : genderEnum;
    sexualinterest : sexualInterestEnum;
    biography: string;
    tags: tagsEnum;
    hasProfilePicture: boolean;
}

export interface UserSettingsArray {
    user: UserSettingsInterface[];
}


