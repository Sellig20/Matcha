-- INSERT INTO table_name (column1, column2, column3,etc)
-- VALUES (value1, value2, value3, etc);

INSERT INTO UserProfile (userProfileID, userName, age, gender, sexualInterest, biography, tags, hasProfilePicture) VALUES (1, 'Lol', 25, 'female', 'women', 'bonjour', 'vegan', 'no');

-- INSERT INTO UserPictures(pictureID, userProfileID, pictureURL, isProfile) VALUES ('')
INSERT INTO UserSettings (userProfileID, validationToken, isValidatedToken, firstName, lastName, email, pass_word) VALUES (1, '2222', 'true', 'Lola', 'Teryaki', 'lolat@gmail.com', 'teri');
