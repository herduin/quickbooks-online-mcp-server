import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
/**
 * Create a purchase in QuickBooks Online
 * @param purchaseData The purchase object to create
 */
export async function createQuickbooksPurchase(purchaseData) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        return new Promise((resolve) => {
            quickbooks.createPurchase(purchaseData, (err, purchase) => {
                if (err) {
                    resolve({
                        result: null,
                        isError: true,
                        error: formatError(err),
                    });
                }
                else {
                    resolve({
                        result: purchase,
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
