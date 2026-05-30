import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function updateQuickbooksPayment(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const paymentPayload = {
            Id: data.id,
            SyncToken: data.sync_token,
            sparse: true,
        };
        if (data.customer_ref) {
            paymentPayload.CustomerRef = { value: data.customer_ref };
        }
        if (data.total_amt !== undefined) {
            paymentPayload.TotalAmt = data.total_amt;
        }
        if (data.payment_method_ref) {
            paymentPayload.PaymentMethodRef = { value: data.payment_method_ref };
        }
        if (data.private_note) {
            paymentPayload.PrivateNote = data.private_note;
        }
        return new Promise((resolve) => {
            quickbooks.updatePayment(paymentPayload, (err, updated) => {
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
