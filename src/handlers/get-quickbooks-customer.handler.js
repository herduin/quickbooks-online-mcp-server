import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
/**
 * Retrieve a single customer by Id from QuickBooks Online
 */
export async function getQuickbooksCustomer(id) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        return new Promise((resolve) => {
            quickbooks.getCustomer(id, (err, customer) => {
                if (err) {
                    resolve({
                        result: null,
                        isError: true,
                        error: formatError(err),
                    });
                }
                else {
                    resolve({
                        result: customer,
                        isError: false,
                        error: null,
                    });
                }
            });
        });
    }
    catch (error) {
        return {
            result: null,
            isError: true,
            error: formatError(error),
        };
    }
}
