import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function createQuickbooksPayment(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const paymentPayload = {
            CustomerRef: { value: data.customer_ref },
            TotalAmt: data.total_amt,
        };
        if (data.payment_method_ref) {
            paymentPayload.PaymentMethodRef = { value: data.payment_method_ref };
        }
        if (data.deposit_to_account_ref) {
            paymentPayload.DepositToAccountRef = { value: data.deposit_to_account_ref };
        }
        if (data.txn_date) {
            paymentPayload.TxnDate = data.txn_date;
        }
        if (data.private_note) {
            paymentPayload.PrivateNote = data.private_note;
        }
        if (data.line) {
            paymentPayload.Line = data.line.map((l) => ({
                Amount: l.amount,
                LinkedTxn: l.linked_txn.map((lt) => ({
                    TxnId: lt.txn_id,
                    TxnType: lt.txn_type,
                })),
            }));
        }
        return new Promise((resolve) => {
            quickbooks.createPayment(paymentPayload, (err, created) => {
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
