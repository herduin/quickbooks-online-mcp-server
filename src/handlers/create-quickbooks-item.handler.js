import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function createQuickbooksItem(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const payload = {
            Name: data.name,
            Type: data.type,
            IncomeAccountRef: { value: data.income_account_ref },
            ExpenseAccountRef: data.expense_account_ref ? { value: data.expense_account_ref } : undefined,
            UnitPrice: data.unit_price,
            Description: data.description,
        };
        return new Promise((resolve) => {
            quickbooks.createItem(payload, (err, item) => {
                if (err)
                    resolve({ result: null, isError: true, error: formatError(err) });
                else
                    resolve({ result: item, isError: false, error: null });
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
