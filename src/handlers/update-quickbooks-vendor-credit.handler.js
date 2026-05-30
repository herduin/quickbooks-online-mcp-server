import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function updateQuickbooksVendorCredit(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const payload = { Id: data.id, SyncToken: data.sync_token, sparse: true };
        if (data.vendor_ref)
            payload.VendorRef = { value: data.vendor_ref };
        if (data.private_note)
            payload.PrivateNote = data.private_note;
        return new Promise((resolve) => {
            quickbooks.updateVendorCredit(payload, (err, updated) => {
                if (err)
                    resolve({ result: null, isError: true, error: formatError(err) });
                else
                    resolve({ result: updated, isError: false, error: null });
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
