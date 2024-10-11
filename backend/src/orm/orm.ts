import { query, pool } from "../db";
import { Schema, TableSchema, FieldDefinition, CreateType } from "./schema";
import errorHandler from "../utils/error";
import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

// TODO : parse db and compare with schema
dotenv.config();

class ORM {
	constructor(schema: Schema) {
		this.schema = schema;
        this.pool = pool;
		this.createTables()
			.then(() => {
				console.log("Tables created successfully.");
			})
			.catch((error) => {
				errorHandler(error, "Failed to create tables during initialization");
			});
	}

	private schema: Schema;
    private pool: Pool;

	private async createTables(): Promise<void> { // TODO : wrap another try catch
		const client = await this.pool.connect();
		try {
			await client.query("BEGIN");
			for (const tableName of Object.keys(this.schema)) {
				await this.createTable(client, tableName, this.schema[tableName]);
			}

			await client.query("COMMIT");
		} catch (error) {
			if (client) {
				console.log("ERROR CATCH CREATE TAVBLEEEEEEEEEEE");
				// await client.query("ROLLBACK");
			}
			errorHandler(error, "Failed to create tables");
		} 
	}

	private async createTable(
        client: PoolClient,
		tableName: string,
		tableSchema: TableSchema
	): Promise<void>{
		const columns: string[] = [];
		for (const columnName of Object.keys(tableSchema)) {
			const fieldDef: FieldDefinition = tableSchema[columnName];
			const columnType = fieldDef[0];
			const constraints = fieldDef.slice(1).join(" ");
			columns.push(`${columnName} ${columnType} ${constraints}`);
		}

		const queryText = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns.join(
			", "
		)})`;
		try {
			await client.query(queryText);
		} catch (error) {
			errorHandler(error, `Failed to create table ${tableName}`);
		}
	}

	async create<T extends keyof Schema>(
		tableName: T,
		createData: CreateType<T>
		//  eslint-disable-next-line @typescript-eslint/no-explicit-any
	): Promise<any | null> {
		const tableSchema = this.schema[tableName] as TableSchema;
		const fields = Object.keys(tableSchema).filter((field) => field !== "id");

		const fieldNames = fields.join(", ");
		const fieldValues = fields.map((field) => {
			const value = createData[field as keyof typeof createData];
			return typeof value === "string" ? `'${value.replace(/'/g, "''")}'` : value;
		}).join(", ");

		const queryText = `INSERT INTO ${tableName} (${fieldNames}) VALUES (${fieldValues}) RETURNING *`;

		try {
			const result = await query(queryText);
			console.log(`Successfully created record in ${tableName}`);
			console.log("Inserted row:", result.rows[0]);
			return result;
		} catch (error) {
			errorHandler(error, `Failed to create record in ${tableName}`);
			return null;
		}
	}

	async update<T extends keyof Schema>(
		tableName: T,
		id: number,
		updateData: Partial<CreateType<T>>
	): Promise<void> {
		const tableSchema = this.schema[tableName] as TableSchema;
		const fields = Object.keys(updateData).filter(
			(field) => field !== "id" && field in tableSchema
		);

		const setClause = fields
			.map(
				(field) =>
					`${field} = '${updateData[field as keyof typeof updateData]}'`
			)
			.join(", ");
		const queryText = `UPDATE ${tableName} SET ${setClause} WHERE id = ${id} RETURNING *`;
		try {
			const result = await query(queryText);
			console.log(`Successfully updated record in ${tableName} with id ${id}`);
			console.log("Updated row:", result.rows[0]);
			return result;
		} catch (error) {
			errorHandler(
				error,
				`Failed to update record in ${tableName} with id ${id}`
			);
		}
	}

	async read<T extends keyof Schema, K extends keyof Schema[T]>(
        tableName: T,
        propertyName: K,
        propertyValue?: string | number
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any[] | null> {
        const tableSchema = this.schema[tableName];
        try {
            if (!(propertyName in tableSchema)) {
                throw new Error(`Table '${tableName}' does not have a '${String(propertyName)}' field.`);
            }
        } catch (error) {
			console.log("-------------------------------------- je suis dans le erreur de read ----------------------------------------");
            errorHandler(error, "");
        }

        let queryText = `SELECT * FROM ${tableName}`;

        if (propertyValue !== undefined) {
            queryText += ` WHERE ${String(propertyName)} = '${propertyValue}'`;
        }

        try {
            const result = await query(queryText);

            if (!result) {
                console.log(`Result is undefined`); // TODO: Handle better
                return null;
            }

            if (result.rows.length === 0) {
                console.log(`No record found in ${tableName} with ${String(propertyName)} ${propertyValue}`);
                return null;
            }

            console.log(`Successfully retrieved record from ${tableName} where ${String(propertyName)} = ${propertyValue}`);
            return result.rows;
        } catch (error) {
            errorHandler(error, `Failed to retrieve record from ${tableName} where ${String(propertyName)} = ${propertyValue}`);
            return null;
        }
    }

	async delete<T extends keyof Schema>(
		tableName: T,
		id: number
	): Promise<void> {
		const tableSchema = this.schema[tableName] as TableSchema;

		try {
			if (!("id" in tableSchema)) {
				throw new Error(`Table '${tableName}' does not have an 'id' field.`);
			}
		} catch (error) {
			errorHandler(error, "");
		}

		const queryText = `DELETE FROM ${tableName} WHERE id = ${id}`;

		try {
			const result = await query(queryText);

			if (result.rowCount === 0) {
				console.log(`No record found in ${tableName} with id ${id}`);
			} else {
				console.log(
					`Successfully deleted record from ${tableName} with id ${id}`
				);
			}
		} catch (error) {
			errorHandler(
				error,
				`Failed to delete record from ${tableName} with id ${id}`
			);
		}
	}
}

export default ORM;