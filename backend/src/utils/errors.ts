function errorHandler(error: unknown, message: string) {
    if (error instanceof Error) {
        throw new Error(`${message}: ${error.message}`);
    } else {
        throw new Error(`${message}: Unknown error`);
    }
}

export default errorHandler