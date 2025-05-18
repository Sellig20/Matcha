export default function errorHandler(error: unknown, message: string): void {
	console.error(`ERROR HANDLER: ${message}`);
	if (error instanceof Error) {
		console.error(`Error Name: ${error.name}`);
		console.error(`Error Message: ${error.message}`);
		if (error.stack) {
			console.error(`Stack Trace: ${error.stack}`);
		}
		if ("code" in error && typeof error.code === "string") {
			console.error(`PostgreSQL Error Code: ${error.code}`);
		}
		if ("detail" in error && typeof error.detail === "string") {
			console.error(`PostgreSQL Error Detail: ${error.detail}`);
		}
	} else if (typeof error === "string") {
		console.error(`Error details: ${error}`);
	} else {
		console.error("An unknown error object was passed to the error handler:");
		console.error(error);
	}
};
