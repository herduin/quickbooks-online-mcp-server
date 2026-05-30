import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function searchQuickbooksPurchaseOrders(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const criteria = {};
        if (data.vendor_ref)
            criteria.VendorRef = data.vendor_ref;
        if (data.txn_date_from)
            criteria.TxnDate = { $gte: data.txn_date_from };
        if (data.txn_date_to)
            criteria.TxnDate = { ...criteria.TxnDate, $lte: data.txn_date_to };
        if (data.limit)
            criteria.limit = data.limit;
        return new Promise((resolve) => {
            quickbooks.findPurchaseOrders(criteria, (err, result) => {
                if (err) {
                    resolve({ result: null, isError: true, error: formatError(err) });
                }
                else {
                    const pos = result?.QueryResponse?.PurchaseOrder || [];
                    resolve({ result: pos, isError: false, error: null });
                }
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
