// src/orm/schemaTypes.ts
import { z } from "zod";

// --- SQL Column Types and Constraints ---
export enum ColumnType {
	SERIAL = "SERIAL",
	BIGSERIAL = "BIGSERIAL",
	VARCHAR = "VARCHAR(255)",
	TEXT = "TEXT",
	INT = "INTEGER",
	DECIMAL = "DECIMAL",
	BOOLEAN = "BOOLEAN",
	TIMESTAMP_TZ = "TIMESTAMP WITH TIME ZONE",
	DATE = "DATE",
}

export enum ColumnConstraint {
	PRIMARY_KEY = "PRIMARY KEY",
	NOT_NULL = "NOT NULL",
	UNIQUE = "UNIQUE",
}

export const defaultTimestamp = "DEFAULT CURRENT_TIMESTAMP";
export const onDeleteCascade = "ON DELETE CASCADE";
export const onDeleteSetNull = "ON DELETE SET NULL";

export type FieldDefinition = [
	ColumnType | string,
	...Array<ColumnConstraint | string>
];

export interface TableSqlSchema {
	[columnName: string]: FieldDefinition | string;
}
export interface AppSqlSchema {
	[tableName: string]: TableSqlSchema;
}

// --- Zod Schemas ---

const DbManagedFields = {
	id: z.number().int().positive(),
	created_at: z.date(),
	updated_at: z.date().nullish(),
};

export const UserGenderEnumZod = z.enum([
	"male",
	"female",
	"non_binary",
	"other",
	"prefer_not_to_say",
]);
export const SexualOrientationEnumZod = z.enum([
	"heterosexual",
	"homosexual",
	"bisexual",
	"pansexual",
	"asexual",
	"other",
	"prefer_not_to_say",
]);
export const NotificationTypeEnumZod = z.enum([
	"new_like",
	"profile_view",
	"new_message",
	"new_connection",
	"unliked",
]);

const UserInputSchema = z.object({
	email: z.string().email(),
	username: z
		.string()
		.min(3)
		.max(50)
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"Username can only contain letters, numbers, and underscores."
		),
	first_name: z.string().min(1).max(50),
	last_name: z.string().min(1).max(50),
	password_hash: z.string(),
	email_verification_token: z.string().uuid().nullable().optional(),
	email_verified_at: z.date().nullable().optional(),
	password_reset_token: z.string().uuid().nullable().optional(),
	password_reset_expires_at: z.date().nullable().optional(),
	gender: UserGenderEnumZod.optional(),
	sexual_orientation: SexualOrientationEnumZod.default("bisexual"),
	biography: z.string().max(1000).nullable().optional(),
	fame_rating: z.number().int().min(0).default(0),
	last_seen_at: z.date().nullable().optional(),
	is_online: z.boolean().default(false).optional(),
	location_latitude: z.number().min(-90).max(90).nullable().optional(),
	location_longitude: z.number().min(-180).max(180).nullable().optional(),
	location_city: z.string().max(100).nullable().optional(),
	location_country: z.string().max(100).nullable().optional(),
	location_manually_set: z.boolean().default(false),
	profile_completed: z.boolean().default(false),
});
export const UserSchema = UserInputSchema.extend(DbManagedFields);
export type User = z.infer<typeof UserSchema>;
export type UserInput = z.input<typeof UserInputSchema>;

const TagInputSchema = z.object({
	name: z
		.string()
		.min(1)
		.max(50)
		.regex(/^[a-zA-Z0-9#_]+$/, "Tags: letters, numbers, #, _"),
});
export const TagSchema = TagInputSchema.extend({
	id: DbManagedFields.id,
	created_at: DbManagedFields.created_at,
});
export type Tag = z.infer<typeof TagSchema>;
export type TagInput = z.input<typeof TagInputSchema>;

const UserTagInputSchema = z.object({
	user_id: z.number().int().positive(),
	tag_id: z.number().int().positive(),
});
export const UserTagSchema = UserTagInputSchema.extend({
	assigned_at: z.date(),
});
export type UserTag = z.infer<typeof UserTagSchema>;
export type UserTagInput = z.input<typeof UserTagInputSchema>;

const UserPictureInputSchema = z.object({
	user_id: z.number().int().positive(),
	url: z.string().url(),
	is_profile_picture: z.boolean().default(false),
});
export const UserPictureSchema = UserPictureInputSchema.extend(DbManagedFields);
export type UserPicture = z.infer<typeof UserPictureSchema>;
export type UserPictureInput = z.input<typeof UserPictureInputSchema>;

const ProfileViewInputSchema = z.object({
	viewer_id: z.number().int().positive(),
	viewed_id: z.number().int().positive(),
});
export const ProfileViewSchema = ProfileViewInputSchema.extend({
	id: DbManagedFields.id,
	viewed_at: DbManagedFields.created_at,
});
export type ProfileView = z.infer<typeof ProfileViewSchema>;
export type ProfileViewInput = z.input<typeof ProfileViewInputSchema>;

const LikeInputSchema = z.object({
	liker_id: z.number().int().positive(),
	liked_user_id: z.number().int().positive(),
});
export const LikeSchema = LikeInputSchema.extend({
	id: DbManagedFields.id,
	liked_at: DbManagedFields.created_at,
});
export type Like = z.infer<typeof LikeSchema>;
export type LikeInput = z.input<typeof LikeInputSchema>;

const ConnectionInputSchema = z.object({
	user1_id: z.number().int().positive(),
	user2_id: z.number().int().positive(),
});
export const ConnectionSchema = ConnectionInputSchema.extend({
	id: DbManagedFields.id,
	connected_at: DbManagedFields.created_at,
});
export type Connection = z.infer<typeof ConnectionSchema>;
export type ConnectionInput = z.input<typeof ConnectionInputSchema>;

const ChatMessageInputSchema = z.object({
	connection_id: z.number().int().positive(),
	sender_id: z.number().int().positive(),
	receiver_id: z.number().int().positive(),
	message_text: z.string().min(1).max(5000),
	read_at: z.date().nullable().optional(),
});
export const ChatMessageSchema = ChatMessageInputSchema.extend({
	id: DbManagedFields.id,
	sent_at: DbManagedFields.created_at,
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatMessageInput = z.input<typeof ChatMessageInputSchema>;

const NotificationInputSchema = z.object({
	user_id: z.number().int().positive(),
	type: NotificationTypeEnumZod,
	actor_id: z.number().int().positive().nullable().optional(),
	related_entity_id: z.number().int().nullable().optional(),
	is_read: z.boolean().default(false),
});
export const NotificationSchema = NotificationInputSchema.extend({
	id: DbManagedFields.id,
	created_at: DbManagedFields.created_at,
});
export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationInput = z.input<typeof NotificationInputSchema>;

const BlockedUserInputSchema = z.object({
	blocker_id: z.number().int().positive(),
	blocked_id: z.number().int().positive(),
});
export const BlockedUserSchema = BlockedUserInputSchema.extend({
	id: DbManagedFields.id,
	blocked_at: DbManagedFields.created_at,
});
export type BlockedUser = z.infer<typeof BlockedUserSchema>;
export type BlockedUserInput = z.input<typeof BlockedUserInputSchema>;

const ReportedUserInputSchema = z.object({
	reporter_id: z.number().int().positive(),
	reported_id: z.number().int().positive(),
	reason: z.string().max(1000).nullable().optional(),
});
export const ReportedUserSchema = ReportedUserInputSchema.extend({
	id: DbManagedFields.id,
	reported_at: DbManagedFields.created_at,
});
export type ReportedUser = z.infer<typeof ReportedUserSchema>;
export type ReportedUserInput = z.input<typeof ReportedUserInputSchema>;

export const AppSchemaMapping = {
	users: { zod: UserSchema, inputZod: UserInputSchema },
	tags: { zod: TagSchema, inputZod: TagInputSchema },
	user_tags: { zod: UserTagSchema, inputZod: UserTagInputSchema },
	user_pictures: { zod: UserPictureSchema, inputZod: UserPictureInputSchema },
	profile_views: { zod: ProfileViewSchema, inputZod: ProfileViewInputSchema },
	likes: { zod: LikeSchema, inputZod: LikeInputSchema },
	connections: { zod: ConnectionSchema, inputZod: ConnectionInputSchema },
	chat_messages: { zod: ChatMessageSchema, inputZod: ChatMessageInputSchema },
	notifications: { zod: NotificationSchema, inputZod: NotificationInputSchema },
	blocked_users: { zod: BlockedUserSchema, inputZod: BlockedUserInputSchema },
	reported_users: {
		zod: ReportedUserSchema,
		inputZod: ReportedUserInputSchema,
	},
};

export type AppTable = keyof typeof AppSchemaMapping;

export type InferEntity<T extends AppTable> = z.infer<
	(typeof AppSchemaMapping)[T]["zod"]
>;
export type InferInput<T extends AppTable> = z.input<
	(typeof AppSchemaMapping)[T]["inputZod"]
>;

// --- SQL Table Definitions ---

export const enumDefinitionsSQL = {
	gender_enum: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_enum') THEN
                CREATE TYPE gender_enum AS ENUM ('male', 'female', 'non_binary', 'other', 'prefer_not_to_say');
            END IF;
        END$$;
    `,
	sexual_orientation_enum: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sexual_orientation_enum') THEN
                CREATE TYPE sexual_orientation_enum AS ENUM ('heterosexual', 'homosexual', 'bisexual', 'pansexual', 'asexual', 'other', 'prefer_not_to_say');
            END IF;
        END$$;
    `,
	notification_type_enum: `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type_enum') THEN
                CREATE TYPE notification_type_enum AS ENUM ('new_like', 'profile_view', 'new_message', 'new_connection', 'unliked');
            END IF;
        END$$;
    `,
};

export const updatedAtTriggerFunctionSQL = `
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`;

export const applyUpdatedAtTriggerSQL = (tableName: string) => `
DROP TRIGGER IF EXISTS set_timestamp ON public."${tableName}";
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public."${tableName}"
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();`;

export const tablesWithUpdatedAtTrigger = ["users", "user_pictures"];

export const sqlSchema: AppSqlSchema = {
	users: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		email: [
			ColumnType.VARCHAR,
			ColumnConstraint.NOT_NULL,
			ColumnConstraint.UNIQUE,
		],
		username: [
			ColumnType.VARCHAR,
			ColumnConstraint.NOT_NULL,
			ColumnConstraint.UNIQUE,
		],
		first_name: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL],
		last_name: [ColumnType.VARCHAR, ColumnConstraint.NOT_NULL],
		password_hash: [ColumnType.TEXT, ColumnConstraint.NOT_NULL],
		email_verification_token: [`VARCHAR(36)`, ColumnConstraint.UNIQUE],
		email_verified_at: [ColumnType.TIMESTAMP_TZ],
		password_reset_token: [`VARCHAR(36)`, ColumnConstraint.UNIQUE],
		password_reset_expires_at: [ColumnType.TIMESTAMP_TZ],
		gender: ["gender_enum"],
		sexual_orientation: ["sexual_orientation_enum", "DEFAULT 'bisexual'"],
		biography: [ColumnType.TEXT],
		fame_rating: [ColumnType.INT, ColumnConstraint.NOT_NULL, "DEFAULT 0"],
		last_seen_at: [ColumnType.TIMESTAMP_TZ],
		is_online: [ColumnType.BOOLEAN, "DEFAULT FALSE"],
		location_latitude: [ColumnType.DECIMAL],
		location_longitude: [ColumnType.DECIMAL],
		location_city: [ColumnType.VARCHAR],
		location_country: [ColumnType.VARCHAR],
		location_manually_set: [ColumnType.BOOLEAN, "DEFAULT FALSE"],
		profile_completed: [ColumnType.BOOLEAN, "DEFAULT FALSE"],
		created_at: [
			ColumnType.TIMESTAMP_TZ,
			ColumnConstraint.NOT_NULL,
			defaultTimestamp,
		],
		updated_at: [
			ColumnType.TIMESTAMP_TZ,
			ColumnConstraint.NOT_NULL,
			defaultTimestamp,
		],
	},
	tags: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		name: [
			ColumnType.VARCHAR,
			ColumnConstraint.NOT_NULL,
			ColumnConstraint.UNIQUE,
		],
		created_at: [
			ColumnType.TIMESTAMP_TZ,
			ColumnConstraint.NOT_NULL,
			defaultTimestamp,
		],
	},
	user_tags: {
		user_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		tag_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES tags(id) ${onDeleteCascade}`,
		],
		assigned_at: [
			ColumnType.TIMESTAMP_TZ,
			ColumnConstraint.NOT_NULL,
			defaultTimestamp,
		],
		_pk_user_tags: "PRIMARY KEY (user_id, tag_id)",
	},
	user_pictures: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		user_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		url: [ColumnType.TEXT, ColumnConstraint.NOT_NULL],
		is_profile_picture: [
			ColumnType.BOOLEAN,
			ColumnConstraint.NOT_NULL,
			"DEFAULT FALSE",
		],
		created_at: [
			ColumnType.TIMESTAMP_TZ,
			ColumnConstraint.NOT_NULL,
			defaultTimestamp,
		],
		updated_at: [
			ColumnType.TIMESTAMP_TZ,
			ColumnConstraint.NOT_NULL,
			defaultTimestamp,
		],
	},
	profile_views: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		viewer_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		viewed_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		viewed_at: [
			ColumnType.TIMESTAMP_TZ,
			ColumnConstraint.NOT_NULL,
			defaultTimestamp,
		],
	},
	likes: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		liker_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		liked_user_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		liked_at: [
			ColumnType.TIMESTAMP_TZ,
			ColumnConstraint.NOT_NULL,
			defaultTimestamp,
		],
		_unique_like: "CONSTRAINT unique_like UNIQUE (liker_id, liked_user_id)",
	},
	connections: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		user1_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		user2_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		connected_at: [
			ColumnType.TIMESTAMP_TZ,
			ColumnConstraint.NOT_NULL,
			defaultTimestamp,
		],
		_check_user_order:
			"CONSTRAINT check_user_order CHECK (user1_id < user2_id)",
		_unique_connection_pair:
			"CONSTRAINT unique_connection_pair UNIQUE (user1_id, user2_id)",
	},
	chat_messages: {
		id: [ColumnType.BIGSERIAL, ColumnConstraint.PRIMARY_KEY],
		connection_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES connections(id) ${onDeleteCascade}`,
		],
		sender_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		receiver_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		message_text: [ColumnType.TEXT, ColumnConstraint.NOT_NULL],
		sent_at: [
			ColumnType.TIMESTAMP_TZ,
			ColumnConstraint.NOT_NULL,
			defaultTimestamp,
		],
		read_at: [ColumnType.TIMESTAMP_TZ],
	},
	notifications: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		user_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		type: ["notification_type_enum", ColumnConstraint.NOT_NULL],
		actor_id: [ColumnType.INT, `REFERENCES users(id) ${onDeleteSetNull}`],
		related_entity_id: [ColumnType.INT],
		is_read: [ColumnType.BOOLEAN, ColumnConstraint.NOT_NULL, "DEFAULT FALSE"],
		created_at: [
			ColumnType.TIMESTAMP_TZ,
			ColumnConstraint.NOT_NULL,
			defaultTimestamp,
		],
	},
	blocked_users: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		blocker_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		blocked_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		blocked_at: [
			ColumnType.TIMESTAMP_TZ,
			ColumnConstraint.NOT_NULL,
			defaultTimestamp,
		],
		_unique_block: "CONSTRAINT unique_block UNIQUE (blocker_id, blocked_id)",
	},
	reported_users: {
		id: [ColumnType.SERIAL, ColumnConstraint.PRIMARY_KEY],
		reporter_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		reported_id: [
			ColumnType.INT,
			ColumnConstraint.NOT_NULL,
			`REFERENCES users(id) ${onDeleteCascade}`,
		],
		reason: [ColumnType.TEXT],
		reported_at: [
			ColumnType.TIMESTAMP_TZ,
			ColumnConstraint.NOT_NULL,
			defaultTimestamp,
		],
		_unique_report:
			"CONSTRAINT unique_report UNIQUE (reporter_id, reported_id)",
	},
};
