import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function deleteQuickbooksPurchaseOrder(idOrEntity) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        return new Promise((resolve) => {
            quickbooks.deletePurchaseOrder(idOrEntity, (err, response) => {
                if (err) {
                    resolve({ result: null, isError: true, error: formatError(err) });
                }
                else {
                    resolve({ result: response, isError: false, error: null });
                }
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
