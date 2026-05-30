import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function createQuickbooksTimeActivity(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const payload = {
            NameOf: data.name_of,
        };
        if (data.vendor_ref)
            payload.VendorRef = { value: data.vendor_ref };
        if (data.employee_ref)
            payload.EmployeeRef = { value: data.employee_ref };
        if (data.customer_ref)
            payload.CustomerRef = { value: data.customer_ref };
        if (data.item_ref)
            payload.ItemRef = { value: data.item_ref };
        if (data.hours !== undefined)
            payload.Hours = data.hours;
        if (data.minutes !== undefined)
            payload.Minutes = data.minutes;
        if (data.start_time)
            payload.StartTime = data.start_time;
        if (data.end_time)
            payload.EndTime = data.end_time;
        if (data.txn_date)
            payload.TxnDate = data.txn_date;
        if (data.description)
            payload.Description = data.description;
        if (data.billable_status)
            payload.BillableStatus = data.billable_status;
        if (data.hourly_rate !== undefined)
            payload.HourlyRate = data.hourly_rate;
        return new Promise((resolve) => {
            quickbooks.createTimeActivity(payload, (err, created) => {
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
