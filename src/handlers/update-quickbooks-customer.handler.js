import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
/**
 * Update an existing customer in QuickBooks Online
 * The customerData object must include Id and SyncToken per Quickbooks API requirements
 */
export async function updateQuickbooksCustomer(customerData) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        return new Promise((resolve) => {
            quickbooks.updateCustomer(customerData, (err, customer) => {
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
