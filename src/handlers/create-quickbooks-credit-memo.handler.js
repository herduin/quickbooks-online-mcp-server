import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function createQuickbooksCreditMemo(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const creditMemoPayload = {
            CustomerRef: { value: data.customer_ref },
            Line: data.line_items.map((l, idx) => ({
                Id: `${idx + 1}`,
                LineNum: idx + 1,
                Description: l.description || undefined,
                Amount: l.qty * l.unit_price,
                DetailType: "SalesItemLineDetail",
                SalesItemLineDetail: {
                    ItemRef: { value: l.item_ref },
                    Qty: l.qty,
                    UnitPrice: l.unit_price,
                },
            })),
        };
        if (data.txn_date) {
            creditMemoPayload.TxnDate = data.txn_date;
        }
        if (data.doc_number) {
            creditMemoPayload.DocNumber = data.doc_number;
        }
        if (data.private_note) {
            creditMemoPayload.PrivateNote = data.private_note;
        }
        return new Promise((resolve) => {
            quickbooks.createCreditMemo(creditMemoPayload, (err, created) => {
                if (err) {
                    resolve({ result: null, isError: true, error: formatError(err) });
                }
                else {
                    resolve({ result: created, isError: false, error: null });
                }
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
