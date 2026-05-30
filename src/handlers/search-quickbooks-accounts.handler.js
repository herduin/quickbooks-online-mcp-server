import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
import { buildQuickbooksSearchCriteria } from "../helpers/build-quickbooks-search-criteria.js";
export async function searchQuickbooksAccounts(criteria) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const normalizedCriteria = buildQuickbooksSearchCriteria(criteria);
        return new Promise((resolve) => {
            quickbooks.findAccounts(normalizedCriteria, (err, accounts) => {
                if (err) {
                    resolve({ result: null, isError: true, error: formatError(err) });
                }
                else {
                    resolve({ result: accounts.QueryResponse.Account || [], isError: false, error: null });
                }
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
