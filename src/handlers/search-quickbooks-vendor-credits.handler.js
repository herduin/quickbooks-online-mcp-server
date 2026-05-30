import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function searchQuickbooksVendorCredits(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const criteria = {};
        if (data.vendor_ref)
            criteria.VendorRef = data.vendor_ref;
        if (data.limit)
            criteria.limit = data.limit;
        return new Promise((resolve) => {
            quickbooks.findVendorCredits(criteria, (err, result) => {
                if (err)
                    resolve({ result: null, isError: true, error: formatError(err) });
                else
                    resolve({ result: result?.QueryResponse?.VendorCredit || [], isError: false, error: null });
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
