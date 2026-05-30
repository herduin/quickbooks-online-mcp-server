import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
/**
 * Update an estimate in QuickBooks Online (must include Id and SyncToken)
 */
export async function updateQuickbooksEstimate(estimateData) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        return new Promise((resolve) => {
            quickbooks.updateEstimate(estimateData, (err, estimate) => {
                if (err) {
                    resolve({
                        result: null,
                        isError: true,
                        error: formatError(err),
                    });
                }
                else {
                    resolve({
                        result: estimate,
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
