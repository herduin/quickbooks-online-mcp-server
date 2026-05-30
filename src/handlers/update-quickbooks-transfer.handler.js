import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function updateQuickbooksTransfer(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const payload = { Id: data.id, SyncToken: data.sync_token, sparse: true };
        if (data.from_account_ref)
            payload.FromAccountRef = { value: data.from_account_ref };
        if (data.to_account_ref)
            payload.ToAccountRef = { value: data.to_account_ref };
        if (data.amount !== undefined)
            payload.Amount = data.amount;
        if (data.private_note)
            payload.PrivateNote = data.private_note;
        return new Promise((resolve) => {
            quickbooks.updateTransfer(payload, (err, updated) => {
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
