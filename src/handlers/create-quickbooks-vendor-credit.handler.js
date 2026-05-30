import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function createQuickbooksVendorCredit(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const payload = {
            VendorRef: { value: data.vendor_ref },
            Line: data.line_items.map((l, idx) => ({
                Id: `${idx + 1}`,
                Amount: l.amount,
                Description: l.description,
                DetailType: "AccountBasedExpenseLineDetail",
                AccountBasedExpenseLineDetail: l.account_ref ? { AccountRef: { value: l.account_ref } } : {},
            })),
        };
        if (data.txn_date)
            payload.TxnDate = data.txn_date;
        if (data.doc_number)
            payload.DocNumber = data.doc_number;
        if (data.private_note)
            payload.PrivateNote = data.private_note;
        return new Promise((resolve) => {
            quickbooks.createVendorCredit(payload, (err, created) => {
                if (err)
                    resolve({ result: null, isError: true, error: formatError(err) });
                else
                    resolve({ result: created, isError: false, error: null });
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
