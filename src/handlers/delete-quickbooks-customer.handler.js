import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
/**
 * Delete a customer (makes them inactive) in QuickBooks Online
 * Accepts either customer id or full customer entity as required by node-quickbooks
 */
export async function deleteQuickbooksCustomer(idOrEntity) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        // node‑quickbooks v1.0.32+ exposes deleteCustomer but some older builds don't.
        const hasDelete = typeof quickbooks.deleteCustomer === "function";
        return new Promise((resolve) => {
            if (hasDelete) {
                quickbooks.deleteCustomer(idOrEntity, (err, response) => {
                    if (err) {
                        // If QuickBooks API itself rejects the delete, fall back to inactive update
                        fallbackInactive(err);
                    }
                    else {
                        resolve({ result: response, isError: false, error: null });
                    }
                });
            }
            else {
                fallbackInactive();
            }
            /**
             * Marks the customer as inactive via updateCustomer.
             */
            function fallbackInactive(originalError) {
                // Helper to fetch entity when only ID supplied
                const getEntity = (cb) => {
                    if (typeof idOrEntity === "object" && idOrEntity?.Id) {
                        cb(idOrEntity);
                    }
                    else {
                        quickbooks.getCustomer(idOrEntity, (e, cust) => cb(cust));
                    }
                };
                getEntity((customerEntity) => {
                    if (!customerEntity || !customerEntity.Id) {
                        resolve({
                            result: null,
                            isError: true,
                            error: formatError(originalError || "Unable to retrieve customer for inactive update"),
                        });
                        return;
                    }
                    // Ensure we have latest SyncToken
                    const inactiveEntity = {
                        Id: customerEntity.Id,
                        SyncToken: customerEntity.SyncToken,
                        Active: false,
                    };
                    quickbooks.updateCustomer(inactiveEntity, (err, resp) => {
                        if (err) {
                            resolve({ result: null, isError: true, error: formatError(err) });
                        }
                        else {
                            resolve({ result: resp, isError: false, error: null });
                        }
                    });
                });
            }
        });
    }
    catch (error) {
        return {
            result: null,
            isError: true,
            error: formatError(error),
        };
    }
}
