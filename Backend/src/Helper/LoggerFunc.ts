import logger from "../Config/loggerConfig";
// Log the full error details
const ErrorLogger = (error: unknown, methodName: string) => {
    logger.error(`Error in ${methodName}`, {
        error: 
            error instanceof Error
            ? {
                name: error.name
            } 
            : error, 
        context: {
            method: methodName,
            timestamp: new Date().toISOString(),
        } 
    })
}

export default ErrorLogger;
