// src/orm/orm.ts
import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";
import { ZodError, ZodObject } from "zod";
import { pool as defaultPool } from "../db";
import errorHandler from "../utils/errorHandler";
import {
	AppSchemaMapping,
	AppTable,
	InferEntity,
	InferInput,
	sqlSchema,
	AppSqlSchema,
	TableSqlSchema,
	FieldDefinition,
	enumDefinitionsSQL,
	updatedAtTriggerFunctionSQL,
	applyUpdatedAtTriggerSQL,
	tablesWithUpdatedAtTrigger,
} from "./schemaTypes";

export interface ReadOptions<T_AppTable extends AppTable> {
	where?: Partial<InferEntity<T_AppTable>>;
	orderBy?:
		| { field: keyof InferEntity<T_AppTable>; direction: "ASC" | "DESC" }
		| Array<{
				field: keyof InferEntity<T_AppTable>;
				direction: "ASC" | "DESC";
		  }>;
	limit?: number;
	offset?: number;
	select?: (keyof InferEntity<T_AppTable>)[];
}

function getEntityZodSchema<T extends AppTable>(
	tableName: T
): (typeof AppSchemaMapping)[T]["zod"] {
	const schema = AppSchemaMapping[tableName]?.zod;
	if (!schema) {
		throw new Error(
			`Entity Zod schema not found for table ${String(tableName)}`
		);
	}
	return schema;
}

function getInputZodSchema<T extends AppTable>(
	tableName: T
): (typeof AppSchemaMapping)[T]["inputZod"] {
	const schema = AppSchemaMapping[tableName]?.inputZod;
	if (!schema) {
		throw new Error(
			`Input Zod schema not found for table ${String(tableName)}`
		);
	}
	return schema;
}

export class ORM {
	private pool: Pool;
	private sqlSchemaDefinition: AppSqlSchema;

	constructor(dbPool: Pool = defaultPool, schemaDef: AppSqlSchema = sqlSchema) {
		this.pool = dbPool;
		this.sqlSchemaDefinition = schemaDef;
	}

	public async initializeDatabase(
		forceRecreate: boolean = false
	): Promise<void> {
		const client = await this.pool.connect();
		try {
			await client.query("BEGIN");

			if (forceRecreate) {
				console.warn(
					"Force recreating tables. Dropping existing tables first (reverse order)..."
				);
				const tableNames = Object.keys(this.sqlSchemaDefinition).reverse();
				for (const tableName of tableNames) {
					await client.query(
						`DROP TABLE IF EXISTS public."${tableName}" CASCADE;`
					);
					console.log(`Table "public.${tableName}" dropped.`);
				}
				console.log("Dropping ENUM types (if they exist)...");
				for (const enumName of Object.keys(enumDefinitionsSQL).reverse()) {
					try {
						await client.query(
							`DROP TYPE IF EXISTS public.${enumName} CASCADE;`
						);
						console.log(`Enum type "public.${enumName}" dropped.`);
					} catch (dropEnumError: any) {
						console.warn(
							`Could not drop enum ${enumName} (may be in use or already dropped): ${dropEnumError.message}`
						);
					}
				}
			}

			console.log("Creating ENUM types...");
			for (const enumName in enumDefinitionsSQL) {
				try {
					await client.query(
						enumDefinitionsSQL[enumName as keyof typeof enumDefinitionsSQL]
					);
					// Adjusted log message for clarity with "IF NOT EXISTS"
					console.log(
						`ENUM type "public.${enumName}" processed (created if it did not exist).`
					);
				} catch (enumError: any) {
					// This catch block is now primarily for unexpected errors,
					// as "IF NOT EXISTS" handles the "already exists" case gracefully in PG 9.6+.
					// The check for '42710' is less critical here but doesn't harm.
					if (enumError.code === "42710") {
						console.log(
							`ENUM type "public.${enumName}" already exists (confirmed by DB error).`
						);
					} else {
						console.error(
							`Error processing ENUM type "public.${enumName}":`,
							enumError
						);
						throw enumError; // Re-throw to abort the transaction for other errors
					}
				}
			}

			console.log("Creating tables based on sqlSchemaDefinition...");
			for (const tableName of Object.keys(this.sqlSchemaDefinition)) {
				await this.createTable(
					client,
					tableName as AppTable,
					this.sqlSchemaDefinition[tableName]
				);
			}

			console.log("Creating updated_at trigger function...");
			await client.query(updatedAtTriggerFunctionSQL);

			console.log("Applying updated_at triggers...");
			for (const tableName of tablesWithUpdatedAtTrigger) {
				if (this.sqlSchemaDefinition[tableName]) {
					await client.query(applyUpdatedAtTriggerSQL(tableName));
					console.log(`Applied updated_at trigger to "public.${tableName}".`);
				}
			}

			await client.query("COMMIT");
			console.log("Database initialized successfully.");
		} catch (error) {
			await client.query("ROLLBACK");
			errorHandler(error, "Failed to initialize database tables");
			throw error;
		} finally {
			client.release();
		}
	}

	private async createTable(
		client: PoolClient,
		tableName: AppTable,
		tableSchema: TableSqlSchema
	): Promise<void> {
		const columnDefinitions: string[] = [];
		const tableLevelConstraints: string[] = [];

		for (const columnNameOrConstraintKey of Object.keys(tableSchema)) {
			const definition = tableSchema[columnNameOrConstraintKey];
			if (typeof definition === "string") {
				tableLevelConstraints.push(definition);
			} else {
				const fieldDef = definition as FieldDefinition;
				const columnTypeOrEnumName = fieldDef[0];
				const constraints = fieldDef.slice(1).join(" ");
				columnDefinitions.push(
					`"${columnNameOrConstraintKey}" ${columnTypeOrEnumName} ${constraints}`
				);
			}
		}

		let queryText = `CREATE TABLE IF NOT EXISTS public."${tableName}" (\n  ${columnDefinitions.join(
			",\n  "
		)}`;
		if (tableLevelConstraints.length > 0) {
			queryText += `,\n  ${tableLevelConstraints.join(",\n  ")}`;
		}
		queryText += `\n)`;

		try {
			await client.query(queryText);
			console.log(`Table "public.${tableName}" created or already exists.`);
		} catch (error) {
			errorHandler(
				error,
				`Failed to create table "public.${tableName}". Query: ${queryText}`
			);
			throw error;
		}
	}

	async create<T_AppTable extends AppTable>(
		tableName: T_AppTable,
		data: InferInput<T_AppTable>
	): Promise<InferEntity<T_AppTable> | null> {
		const inputZodSchema = getInputZodSchema(tableName);
		const entityZodSchema = getEntityZodSchema(tableName);

		try {
			const validatedData = inputZodSchema.parse(data);
			type SpecificValidatedDataType = typeof validatedData;
			const keysOfValidatedData = Object.keys(validatedData) as Array<
				keyof SpecificValidatedDataType
			>;

			const filteredKeys = keysOfValidatedData.filter(
				(key) => validatedData[key] !== undefined
			);

			if (filteredKeys.length === 0) {
				console.warn(
					`No valid fields to insert for table ${String(tableName)}. Data:`,
					data
				);
				return null;
			}

			const fieldNames = filteredKeys
				.map((key) => `"${String(key)}"`)
				.join(", ");
			const valuePlaceholders = filteredKeys
				.map((_, i) => `$${i + 1}`)
				.join(", ");
			const fieldValues = filteredKeys.map((key) => validatedData[key]);

			const queryText = `INSERT INTO public."${String(
				tableName
			)}" (${fieldNames}) VALUES (${valuePlaceholders}) RETURNING *`;

			const result: QueryResult<InferEntity<T_AppTable>> =
				await this.pool.query(queryText, fieldValues);

			if (result.rows.length > 0) {
				return entityZodSchema.parse(result.rows[0]);
			}
			return null;
		} catch (error: unknown) {
			if (error instanceof ZodError) {
				console.error(
					`Validation error creating record in ${String(tableName)}:`,
					error.format()
				);
			} else {
				errorHandler(error, `Failed to create record in ${String(tableName)}.`);
			}
			return null;
		}
	}

	async update<T_AppTable extends AppTable>(
		tableName: T_AppTable,
		id: number,
		data: Partial<InferInput<T_AppTable>>
	): Promise<InferEntity<T_AppTable> | null> {
		const updateSchema = getInputZodSchema(tableName).partial();
		const entitySchema = getEntityZodSchema(tableName);

		try {
			const validatedData = updateSchema.parse(data);
			type SpecificValidatedDataType = typeof validatedData;

			const keysOfValidatedData = Object.keys(validatedData) as Array<
				keyof SpecificValidatedDataType
			>;

			const fieldsToUpdate = keysOfValidatedData.filter(
				(key) => validatedData[key] !== undefined
			);

			if (fieldsToUpdate.length === 0) {
				console.warn(
					`No fields to update for ID ${id} in ${String(tableName)}. Data:`,
					data
				);
				return this.readById(tableName, id);
			}

			const setClause = fieldsToUpdate
				.map((field, i) => `"${String(field)}" = $${i + 1}`)
				.join(", ");
			const fieldValues = fieldsToUpdate.map((field) => validatedData[field]);

			const queryText = `UPDATE public."${String(
				tableName
			)}" SET ${setClause} WHERE "id" = $${
				fieldsToUpdate.length + 1
			} RETURNING *`;
			const allValues = [...fieldValues, id];

			const result: QueryResult<InferEntity<T_AppTable>> =
				await this.pool.query(queryText, allValues);

			if (result.rows.length > 0) {
				return entitySchema.parse(result.rows[0]);
			}
			console.log(
				`No record found to update in ${String(tableName)} with id ${id}`
			);
			return null;
		} catch (error: unknown) {
			if (error instanceof ZodError) {
				console.error(
					`Validation error updating record in ${String(
						tableName
					)} with id ${id}:`,
					error.format()
				);
			} else {
				errorHandler(
					error,
					`Failed to update record in ${String(tableName)} with id ${id}.`
				);
			}
			return null;
		}
	}

	async read<T_AppTable extends AppTable>(
		tableName: T_AppTable,
		options?: ReadOptions<T_AppTable>
	): Promise<InferEntity<T_AppTable>[]> {
		const entitySchema = getEntityZodSchema(tableName);
		const tableShape = (entitySchema as ZodObject<any, any, any>).shape;

		const selectedColumns =
			options?.select?.map((col) => `"${String(col)}"`).join(", ") || "*";
		let queryText = `SELECT ${selectedColumns} FROM public."${String(
			tableName
		)}"`;
		const queryParams: any[] = [];
		let paramIndex = 1;

		if (options?.where && Object.keys(options.where).length > 0) {
			const whereConditions: string[] = [];
			for (const key of Object.keys(options.where) as Array<
				keyof InferEntity<T_AppTable>
			>) {
				if (key in tableShape) {
					const value = options.where[key];
					if (value === null) {
						whereConditions.push(`"${String(key)}" IS NULL`);
					} else if (value !== undefined) {
						whereConditions.push(`"${String(key)}" = $${paramIndex++}`);
						queryParams.push(value);
					}
				} else {
					console.warn(
						`Invalid where condition key: ${String(key)} for table ${String(
							tableName
						)}`
					);
				}
			}
			if (whereConditions.length > 0) {
				queryText += ` WHERE ${whereConditions.join(" AND ")}`;
			}
		}

		if (options?.orderBy) {
			const orderByItems = Array.isArray(options.orderBy)
				? options.orderBy
				: [options.orderBy];
			const orderByClauses = orderByItems
				.map((orderItem) => {
					if (orderItem.field in tableShape) {
						return `"${String(
							orderItem.field
						)}" ${orderItem.direction.toUpperCase()}`;
					}
					console.warn(
						`Invalid orderBy field: ${String(
							orderItem.field
						)} for table ${String(tableName)}`
					);
					return null;
				})
				.filter((clause): clause is string => clause !== null);

			if (orderByClauses.length > 0) {
				queryText += ` ORDER BY ${orderByClauses.join(", ")}`;
			}
		}

		if (options?.limit !== undefined) {
			queryText += ` LIMIT $${paramIndex++}`;
			queryParams.push(options.limit);
		}
		if (options?.offset !== undefined) {
			queryText += ` OFFSET $${paramIndex++}`;
			queryParams.push(options.offset);
		}

		try {
			const result: QueryResult<InferEntity<T_AppTable>> =
				await this.pool.query(queryText, queryParams);
			return result.rows.map((row) => entitySchema.parse(row));
		} catch (error: unknown) {
			if (error instanceof ZodError) {
				const typedError = error as ZodError & { input?: unknown };
				console.error(
					`Data validation error on read from ${String(tableName)}:`,
					typedError.format(),
					"Problematic row data (if available):",
					typedError.input
				);
			} else {
				errorHandler(
					error,
					`Failed to retrieve records from ${String(tableName)}.`
				);
			}
			return [];
		}
	}

	async readById<T_AppTable extends AppTable>(
		tableName: T_AppTable,
		id: number
	): Promise<InferEntity<T_AppTable> | null> {
		const whereCondition = { id } as unknown as Partial<
			InferEntity<T_AppTable>
		>;
		const results = await this.read(tableName, {
			where: whereCondition,
			limit: 1,
		});
		return results.length > 0 ? results[0] : null;
	}

	async delete<T_AppTable extends AppTable>(
		tableName: T_AppTable,
		id: number
	): Promise<boolean> {
		const queryText = `DELETE FROM public."${String(
			tableName
		)}" WHERE "id" = $1`;
		try {
			const result = await this.pool.query(queryText, [id]);
			return result.rowCount !== null && result.rowCount > 0;
		} catch (error) {
			errorHandler(
				error,
				`Failed to delete record from ${String(tableName)} with id ${id}`
			);
			return false;
		}
	}

	async findOne<T_AppTable extends AppTable>(
		tableName: T_AppTable,
		options: Omit<ReadOptions<T_AppTable>, "limit">
	): Promise<InferEntity<T_AppTable> | null> {
		const findOptions: ReadOptions<T_AppTable> = { ...options, limit: 1 };
		const results = await this.read(tableName, findOptions);
		return results.length > 0 ? results[0] : null;
	}

	async customQuery<R extends QueryResultRow = any>(
		queryText: string,
		params?: any[]
	): Promise<QueryResult<R>> {
		try {
			return await this.pool.query<R>(queryText, params);
		} catch (error) {
			errorHandler(
				error,
				`Failed to execute custom query: ${queryText.substring(0, 100)}...`
			);
			throw error;
		}
	}
}

export default ORM;
