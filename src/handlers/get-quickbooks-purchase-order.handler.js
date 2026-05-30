import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function getQuickbooksPurchaseOrder(id) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        return new Promise((resolve) => {
            quickbooks.getPurchaseOrder(id, (err, po) => {
                if (err) {
                    resolve({ result: null, isError: true, error: formatError(err) });
                }
                else {
                    resolve({ result: po, isError: false, error: null });
                }
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
