import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function getQuickbooksCustomerBalance(options) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const params = {};
        if (options.report_date)
            params.report_date = options.report_date;
        if (options.customer)
            params.customer = options.customer;
        if (options.summarize_column_by)
            params.summarize_column_by = options.summarize_column_by;
        return new Promise((resolve) => {
            quickbooks.reportCustomerBalance(params, (err, report) => {
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
