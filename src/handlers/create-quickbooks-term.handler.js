import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function createQuickbooksTerm(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const payload = { Name: data.name };
        if (data.due_days !== undefined)
            payload.DueDays = data.due_days;
        if (data.discount_days !== undefined)
            payload.DiscountDays = data.discount_days;
        if (data.discount_percent !== undefined)
            payload.DiscountPercent = data.discount_percent;
        if (data.type)
            payload.Type = data.type;
        if (data.day_of_month_due !== undefined)
            payload.DayOfMonthDue = data.day_of_month_due;
        if (data.due_next_month_days !== undefined)
            payload.DueNextMonthDays = data.due_next_month_days;
        if (data.discount_day_of_month !== undefined)
            payload.DiscountDayOfMonth = data.discount_day_of_month;
        return new Promise((resolve) => {
            quickbooks.createTerm(payload, (err, created) => {
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
