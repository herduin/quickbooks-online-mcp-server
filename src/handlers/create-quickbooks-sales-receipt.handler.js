import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function createQuickbooksSalesReceipt(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const salesReceiptPayload = {
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
            salesReceiptPayload.PaymentMethodRef = { value: data.payment_method_ref };
        }
        if (data.deposit_to_account_ref) {
            salesReceiptPayload.DepositToAccountRef = { value: data.deposit_to_account_ref };
        }
        if (data.txn_date) {
            salesReceiptPayload.TxnDate = data.txn_date;
        }
        if (data.doc_number) {
            salesReceiptPayload.DocNumber = data.doc_number;
        }
        if (data.private_note) {
            salesReceiptPayload.PrivateNote = data.private_note;
        }
        return new Promise((resolve) => {
            quickbooks.createSalesReceipt(salesReceiptPayload, (err, created) => {
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
