import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
import { buildQuickbooksSearchCriteria } from "../helpers/build-quickbooks-search-criteria.js";
/**
 * Search for invoices in QuickBooks Online using criteria supported by node-quickbooks findInvoices.
 */
export async function searchQuickbooksInvoices(criteria) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const normalizedCriteria = buildQuickbooksSearchCriteria(criteria);
        return new Promise((resolve) => {
            quickbooks.findInvoices(normalizedCriteria, (err, invoices) => {
                if (err) {
                    resolve({ result: null, isError: true, error: formatError(err) });
                }
                else {
                    resolve({
                        result: invoices.QueryResponse.Invoice || [],
                        isError: false,
                        error: null,
                    });
                }
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
