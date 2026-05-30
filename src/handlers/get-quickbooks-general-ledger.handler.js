import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function getQuickbooksGeneralLedger(options) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const params = {};
        if (options.start_date)
            params.start_date = options.start_date;
        if (options.end_date)
            params.end_date = options.end_date;
        if (options.accounting_method)
            params.accounting_method = options.accounting_method;
        if (options.account)
            params.account = options.account;
        if (options.source_account)
            params.source_account = options.source_account;
        if (options.sort_by)
            params.sort_by = options.sort_by;
        return new Promise((resolve) => {
            quickbooks.reportGeneralLedgerDetail(params, (err, report) => {
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
