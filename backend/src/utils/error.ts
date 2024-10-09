function errorHandler(error: unknown, message: string) {
    if (error instanceof Error) {
        console.log("\nERROR MESSAGE IS : ", message, "\nFOR ERROR : ", error, "\n");
    } else {
        // throw new Error(`${message}: Unknown error`);
        console.log("\nERROR MESSAGE IS : ", message, "\nFOR ERROR : ", error, "\n");
    }
}

export default errorHandler