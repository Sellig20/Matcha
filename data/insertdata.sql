-- INSERT INTO table_name (column1, column2, column3,etc)
-- VALUES (value1, value2, value3, etc);

INSERT INTO UserProfile (userProfileID, userName, age, gender, sexualInterest, biography, tags, hasProfilePicture) VALUES (1, 'Lol', 25, 'female', 'women', 'bonjour', 'vegan', 'no');
INSERT INTO UserProfile (userProfileID, userName, age, gender, sexualInterest, biography, tags, hasProfilePicture) VALUES (2, 'Tim', 20, 'male', 'women', 'bio bababa', 'piercing', 'no');
INSERT INTO UserProfile (userProfileID, userName, age, gender, sexualInterest, biography, tags, hasProfilePicture) VALUES (3, 'Lol', 25, 'male', 'women', 'bio bababa', 'geek', 'no');

-- INSERT INTO UserPictures(pictureID, userProfileID, pictureURL, isProfile) VALUES ('')
INSERT INTO UserSettings (userProfileID, validationToken, isValidatedToken, firstName, lastName, email, pass_word) VALUES (1, '2222', 'true', 'Lola', 'Teryaki', 'lolaT@gmail.com', 'teri');
INSERT INTO UserSettings (userProfileID, validationToken, isValidatedToken, firstName, lastName, email, pass_word) VALUES (2, '2223', 'true', 'Timote', 'Baobab', 'timB@gmail.com', 'teri');
INSERT INTO UserSettings (userProfileID, validationToken, isValidatedToken, firstName, lastName, email, pass_word) VALUES (3, '2224', 'true', 'Fared', 'Stylo', 'faredS@gmail.com', 'teri');
