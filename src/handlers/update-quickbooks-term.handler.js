import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function updateQuickbooksTerm(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const payload = { Id: data.id, SyncToken: data.sync_token, sparse: true };
        if (data.name)
            payload.Name = data.name;
        if (data.active !== undefined)
            payload.Active = data.active;
        if (data.due_days !== undefined)
            payload.DueDays = data.due_days;
        if (data.discount_days !== undefined)
            payload.DiscountDays = data.discount_days;
        if (data.discount_percent !== undefined)
            payload.DiscountPercent = data.discount_percent;
        return new Promise((resolve) => {
            quickbooks.updateTerm(payload, (err, updated) => {
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
