import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function getQuickbooksVendorExpenses(options) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const params = {};
        if (options.start_date)
            params.start_date = options.start_date;
        if (options.end_date)
            params.end_date = options.end_date;
        if (options.vendor)
            params.vendor = options.vendor;
        if (options.summarize_column_by)
            params.summarize_column_by = options.summarize_column_by;
        if (options.accounting_method)
            params.accounting_method = options.accounting_method;
        return new Promise((resolve) => {
            quickbooks.reportVendorExpenses(params, (err, report) => {
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
