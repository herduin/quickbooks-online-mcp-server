import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function createQuickbooksDeposit(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const payload = {
            DepositToAccountRef: { value: data.deposit_to_account_ref },
            Line: data.line_items.map((l, idx) => ({
                Id: `${idx + 1}`,
                Amount: l.amount,
                Description: l.description,
                DetailType: "DepositLineDetail",
                DepositLineDetail: {
                    AccountRef: l.account_ref ? { value: l.account_ref } : undefined,
                    Entity: l.entity_ref ? { Type: l.entity_ref.type, EntityRef: { value: l.entity_ref.value } } : undefined,
                },
            })),
        };
        if (data.txn_date)
            payload.TxnDate = data.txn_date;
        if (data.private_note)
            payload.PrivateNote = data.private_note;
        return new Promise((resolve) => {
            quickbooks.createDeposit(payload, (err, created) => {
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
