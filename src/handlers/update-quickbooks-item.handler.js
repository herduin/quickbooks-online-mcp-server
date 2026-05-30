import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function updateQuickbooksItem({ item_id, patch }) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        // Need SyncToken; fetch existing item first
        const existing = await new Promise((res, rej) => {
            quickbooks.getItem(item_id, (e, item) => (e ? rej(e) : res(item)));
        });
        const payload = { ...existing, ...patch, Id: item_id, sparse: true };
        return new Promise((resolve) => {
            quickbooks.updateItem(payload, (err, updated) => {
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
