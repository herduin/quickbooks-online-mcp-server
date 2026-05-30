import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function createQuickbooksRefundReceipt(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const refundReceiptPayload = {
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
        if (data.payment_method_ref) {
            refundReceiptPayload.PaymentMethodRef = { value: data.payment_method_ref };
        }
        if (data.deposit_to_account_ref) {
            refundReceiptPayload.DepositToAccountRef = { value: data.deposit_to_account_ref };
        }
        if (data.txn_date) {
            refundReceiptPayload.TxnDate = data.txn_date;
        }
        if (data.doc_number) {
            refundReceiptPayload.DocNumber = data.doc_number;
        }
        if (data.private_note) {
            refundReceiptPayload.PrivateNote = data.private_note;
        }
        return new Promise((resolve) => {
            quickbooks.createRefundReceipt(refundReceiptPayload, (err, created) => {
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
