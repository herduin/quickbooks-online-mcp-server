import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function searchQuickbooksBudgets(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const criteria = {};
        if (data.name)
            criteria.Name = data.name;
        if (data.active !== undefined)
            criteria.Active = data.active;
        if (data.limit)
            criteria.limit = data.limit;
        return new Promise((resolve) => {
            quickbooks.findBudgets(criteria, (err, result) => {
                if (err)
                    resolve({ result: null, isError: true, error: formatError(err) });
                else
                    resolve({ result: result?.QueryResponse?.Budget || [], isError: false, error: null });
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
