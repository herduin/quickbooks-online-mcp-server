import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
/**
 * Search estimates from QuickBooks Online using the supplied criteria.
 * The criteria object is passed directly to node‑quickbooks `findEstimates`.
 */
export async function searchQuickbooksEstimates(criteria = {}) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        return new Promise((resolve) => {
            quickbooks.findEstimates(criteria, (err, estimates) => {
                if (err) {
                    resolve({
                        result: null,
                        isError: true,
                        error: formatError(err),
                    });
                }
                else {
                    resolve({
                        result: estimates?.QueryResponse?.Estimate ??
                            estimates?.QueryResponse?.totalCount ??
                            [],
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
