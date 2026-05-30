import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
/**
 * Delete (make inactive) an item in QuickBooks Online
 */
export async function deleteQuickbooksItem(idOrEntity) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        return new Promise((resolve) => {
            // Helper to fetch entity when only ID supplied
            const getEntity = (cb) => {
                if (typeof idOrEntity === "object" && idOrEntity?.Id) {
                    cb(idOrEntity);
                }
                else {
                    quickbooks.getItem(idOrEntity, (e, item) => cb(item));
                }
            };
            getEntity((itemEntity) => {
                if (!itemEntity || !itemEntity.Id) {
                    resolve({
                        result: null,
                        isError: true,
                        error: formatError("Unable to retrieve item for inactive update"),
                    });
                    return;
                }
                // Mark item as inactive
                const inactiveEntity = {
                    Id: itemEntity.Id,
                    SyncToken: itemEntity.SyncToken,
                    Active: false,
                    sparse: true,
                };
                quickbooks.updateItem(inactiveEntity, (err, resp) => {
                    if (err) {
                        resolve({ result: null, isError: true, error: formatError(err) });
                    }
                    else {
                        resolve({ result: resp, isError: false, error: null });
                    }
                });
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
