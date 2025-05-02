function errorHandler(error: unknown, message: string) {
    if (error instanceof Error) {
        console.log("\nERROR MESSAGE IS : ", message, "\nFOR ERROR : ", error, "\n");
    } else {
        console.log("\nERROR MESSAGE IS : ", message, "\nFOR ERROR : ", error, "\n");
        throw new Error(`${message}: Unknown error`);
    }
}

export default errorHandler