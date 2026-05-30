import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function getQuickbooksAgedReceivables(options) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const params = {};
        if (options.report_date)
            params.report_date = options.report_date;
        if (options.customer)
            params.customer = options.customer;
        if (options.aging_method)
            params.aging_method = options.aging_method;
        if (options.days_per_aging_period)
            params.days_per_aging_period = options.days_per_aging_period;
        if (options.num_periods)
            params.num_periods = options.num_periods;
        return new Promise((resolve) => {
            quickbooks.reportAgedReceivables(params, (err, report) => {
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
