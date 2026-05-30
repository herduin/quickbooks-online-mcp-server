import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function updateQuickbooksInvoice({ invoice_id, patch }) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        // Need SyncToken; fetch existing invoice first
        const existing = await new Promise((res, rej) => {
            quickbooks.getInvoice(invoice_id, (e, inv) => (e ? rej(e) : res(inv)));
        });
        const updatePayload = { ...existing, ...patch, Id: invoice_id, sparse: true };
        return new Promise((resolve) => {
            quickbooks.updateInvoice(updatePayload, (err, updated) => {
                if (err) {
                    resolve({ result: null, isError: true, error: formatError(err) });
                }
                else {
                    resolve({ result: updated, isError: false, error: null });
                }
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
