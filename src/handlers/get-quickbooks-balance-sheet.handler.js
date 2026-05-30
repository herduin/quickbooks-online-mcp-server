import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function getQuickbooksBalanceSheet(options) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        // Balance Sheet is a point-in-time report — end_date is the "as of" date.
        // start_date is not a valid QBO param for Balance Sheet and was causing
        // end_date to be silently ignored in some configurations.
        const params = {};
        if (options.end_date)
            params.end_date = options.end_date;
        if (options.accounting_method)
            params.accounting_method = options.accounting_method;
        if (options.summarize_column_by)
            params.summarize_column_by = options.summarize_column_by;
        return new Promise((resolve) => {
            quickbooks.reportBalanceSheet(params, (err, report) => {
                if (err)
                    resolve({ result: null, isError: true, error: formatError(err) });
                else
                    resolve({ result: report, isError: false, error: null });
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
