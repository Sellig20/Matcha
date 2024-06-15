CREATE TYPE genderEnum as ENUM ('female', 'non-binary', 'male');
CREATE TYPE sexualInterestEnum as ENUM ('women', 'men', 'both', 'not-specified');
CREATE TYPE tagsEnum as ENUM ('vegetarian', 'vegan', 'tattoo', 'piercing', 'gamer', 'geek', 'karaoke', 'sport', 'karate', 'badminton', 'running', 'boxing', 'hike', 'football', 'fitness', 'food', 'travel', 'art', 'music', 'guitare', 'saxophone', 'painting', 'concert', 'danse', 'cinema', 'yoga');

-- 1) creer un user : sign up
CREATE TABLE UserSettings (
    userSettingsID SERIAL PRIMARY KEY,
    validationToken VARCHAR(500) NOT NULL UNIQUE,
    isValidatedToken BOOLEAN DEFAULT FALSE,
    firstName VARCHAR(15) NOT NULL,
    lastName VARCHAR(15) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    pass_word VARCHAR(100) NOT NULL
);
-- 2) signup mene a completer son profile : d'abord on check si usersettings est valide pour le user + question pour le GPS, puis si c'est ok il est mené à userprofile to complete
CREATE TABLE UserProfile (
    userProfileID SERIAL PRIMARY KEY,
    userSettingsID INTEGER REFERENCES UserSettings(userSettingsID) ON DELETE CASCADE,
    userName VARCHAR(15) NOT NULL,
    age INTEGER NOT NULL,
    gender genderEnum NOT NULL,
    sexualInterest sexualInterestEnum NOT NULL,
    biography VARCHAR(150) NOT NULL,
    tags tagsEnum NOT NULL,
    -- last_Active TIMESTAMP,
    hasProfilePicture BOOLEAN DEFAULT FALSE
);

CREATE TABLE UserPictures (
    pictureID SERIAL PRIMARY KEY,
    userProfileID INTEGER REFERENCES UserProfile(userProfileID) ON DELETE CASCADE,
    pictureURL VARCHAR(255) NOT NULL,
    isProfile BOOLEAN DEFAULT FALSE
);

CREATE TABLE Block (
    blockID SERIAL PRIMARY KEY,
    userProfileID INTEGER REFERENCES UserProfile(userProfileID) ON DELETE CASCADE,
    userBlockedID INTEGER NOT NULL
);

CREATE TABLE FakeAccount (
    fakeAccountID SERIAL PRIMARY KEY,
    userProfileID INTEGER REFERENCES UserProfile(userProfileID) ON DELETE CASCADE,
    userFakeAccountID INTEGER NOT NULL
);

CREATE TABLE FameRating (
    fameRatingID SERIAL PRIMARY KEY,
    userProfileID INTEGER REFERENCES UserProfile(userProfileID) ON DELETE CASCADE,
    viewsNumber INTEGER NOT NULL,
    likesNumber INTEGER NOT NULL,
    matchasNumber INTEGER NOT NULL,
    average INTEGER NOT NULL
);

CREATE TABLE Map (
    mapUserID SERIAL PRIMARY KEY,
    userProfileID INTEGER REFERENCES UserProfile(userProfileID) ON DELETE CASCADE,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    last_active TIMESTAMP
);

CREATE TABLE ChatRooms (
    chatRoomID SERIAL PRIMARY KEY,
    chatRoomName VARCHAR(9)
);

CREATE TABLE Messages (
    messageID SERIAL PRIMARY KEY,
    chatRoomID INTEGER REFERENCES ChatRooms(chatRoomID) ON DELETE CASCADE,
    userID INTEGER REFERENCES UserProfile(userProfileID) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'sent'
);

-- INSERT INTO UserProfile (userProfileID, userName, age, gender, sexualInterest, biography, tags, hasProfilePicture) VALUES ('0', 'Lol', '25', 'female', 'women', 'bonjour', 'vegan', 'no');