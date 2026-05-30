/**
 * Formats an error into a standardized error message
 * @param error Any error object to format
 * @returns A formatted error message as a string
 */
export function formatError(error) {
    if (error instanceof Error) {
        return `Error: ${error.message}`;
    }
    else if (typeof error === 'string') {
        return `Error: ${error}`;
    }
    else {
        return `Unknown error: ${JSON.stringify(error)}`;
    }
}
