// Create types

export type CreateType<T extends keyof Schema> =
  T extends "users" ? UserCreate :
  T extends "users_sexual_preferences" ? UsersSexualPreferencesCreate :
  T extends "users_age_range_preferences" ? UsersAgeRangePreferencesCreate :
  T extends "interests" ? InterestsCreate :
  T extends "users_interests" ? UsersInterestsCreate :
  T extends "users_pictures" ? UsersPicturesCreate :
  T extends "users_pictures_likes" ? UsersPicturesLikesCreate :
  T extends "users_profiles_views" ? UsersProfilesViewsCreate :
  T extends "users_likes" ? UsersLikesCreate :
  T extends "users_blocks" ? UsersBlocksCreate :
  T extends "users_reports" ? UsersReportsCreate :
  T extends "users_messages" ? UsersMessagesCreate :
  never;

export interface UserCreate {
    user_name: string,
    email: string,
    first_name: string,
    last_name: string,
    password_hash: string,
    gender: string,
    biography: string,
    fame_rating: number,
    stated_location: string,
    real_location: string,
  }
  
export interface UsersSexualPreferencesCreate {
    name: string,
    user_id: number,
}

export interface UsersAgeRangePreferencesCreate {
    lower_bound: number,
    upper_bound: number,
    user_id: number,
}

export interface InterestsCreate {
    name: string,
    color: string,
}

export interface UsersInterestsCreate {
    name: string,
    user_id: number,
}

export interface UsersPicturesCreate {
    url: string,
    is_profile_picture: boolean,
    uploaded_on: string,
    user_id: number,
}

export interface UsersPicturesLikesCreate {
    user_id: number,
    picture_id: number,
    liked_on: string,
}

export interface UsersProfilesViewsCreate {
    user_viewer_id: number,
    user_viewed_id: number,
    view_started_on: string,
    view_ended_on: string,
}

export interface UsersLikesCreate {
    user_id: number,
    liked_user_id: number,
    liked_on: string,
}

export interface UsersBlocksCreate {
    user_id: number,
    blocked_user_id: number,
    blocked_on: string,
}

export interface UsersReportsCreate {
    user_id: number,
    reported_user_id: number,
    reported_on: string,
}

export interface UsersMessagesCreate {
    sender_id: number,
    receiver_id: number,
    message: string,
    sent_on: string,
    seen_on: string,
}

// Schema types

export enum ColumnType {
	SERIAL = "serial",
	VARCHAR = "varchar",
	INT = "int",
	BOOLEAN = "boolean",
	TIMESTAMP = "timestamp",
}

export enum ColumnConstraint {
	PRIMARY_KEY = "primary key",
	NOT_NULL = "not null",
	REFERENCES_USER_ID = "references users(id)",
	REFERENCES_USERS_PICTURES_ID = "references users_pictures(id)",
}

export type FieldDefinition = [ColumnType, ...ColumnConstraint[]];

export interface TableSchema {
	[columnName: string]: FieldDefinition;
}

export interface Schema {
	[tableName: string]: TableSchema;
}

// Schema

export const schema: Schema = {
	users: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		user_name: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL],
		email: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL], // regex
		first_name: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL],
		last_name: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL],
		password_hash: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL],
		gender: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL], // enum
		biography: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL],
		fame_rating: [ColumnType.INT, ColumnConstraint.NOT_NULL],
		stated_location: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL],
		real_location: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL],
	},

	users_sexual_preferences: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		name: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL], // enum
		user_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
	},

	users_age_range_preferences: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		lower_bound: [ColumnType.INT, ColumnConstraint.NOT_NULL], // check >= 18
		upper_bound: [ColumnType.INT, ColumnConstraint.NOT_NULL], // enum <= 61
		user_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
	},

	interests: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		name: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL], // enum
		color: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL], // enum check valid color
	},

	users_interests: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		name: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL], // enum
		user_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
	},

	users_pictures: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		url: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL], // or binary
		is_profile_picture: [ColumnType.BOOLEAN, ColumnConstraint.NOT_NULL],
		uploaded_on: [ColumnType.TIMESTAMP, ColumnConstraint.NOT_NULL],
		user_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
	},

	users_pictures_likes: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		user_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
		picture_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USERS_PICTURES_ID],
		liked_on: [ColumnType.TIMESTAMP, ColumnConstraint.NOT_NULL],
	},

	users_profiles_views: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		user_viewer_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
		user_viewed_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
		view_started_on: [ColumnType.TIMESTAMP, ColumnConstraint.NOT_NULL],
		view_ended_on: [ColumnType.TIMESTAMP, ColumnConstraint.NOT_NULL],
	},

	user_likes: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		user_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
		liked_user_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
		liked_on: [ColumnType.TIMESTAMP, ColumnConstraint.NOT_NULL],
	},

	users_blocks: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		user_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
		blocked_user_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
		blocked_on: [ColumnType.TIMESTAMP, ColumnConstraint.NOT_NULL],
	},

	users_reports: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		user_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
		reported_user_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
		reported_on: [ColumnType.TIMESTAMP, ColumnConstraint.NOT_NULL],
	},

	users_messages: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		sender_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
		receiver_id: [ColumnType.INT, ColumnConstraint.REFERENCES_USER_ID],
		message: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL],
		sent_on: [ColumnType.TIMESTAMP, ColumnConstraint.NOT_NULL],
		seen_on: [ColumnType.TIMESTAMP, ColumnConstraint.NOT_NULL],
	},
};