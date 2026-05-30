import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
/**
 * Delete (void) an invoice in QuickBooks Online
 * Note: QuickBooks doesn't truly delete invoices - it voids them
 */
export async function deleteQuickbooksInvoice(idOrEntity) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        return new Promise((resolve) => {
            // Try deleteInvoice first if available
            const hasDelete = typeof quickbooks.deleteInvoice === "function";
            if (hasDelete) {
                quickbooks.deleteInvoice(idOrEntity, (err, response) => {
                    if (err) {
                        // If delete fails, try voiding the invoice
                        voidInvoice(err);
                    }
                    else {
                        resolve({ result: response, isError: false, error: null });
                    }
                });
            }
            else {
                voidInvoice();
            }
            function voidInvoice(originalError) {
                // Helper to fetch entity when only ID supplied
                const getEntity = (cb) => {
                    if (typeof idOrEntity === "object" && idOrEntity?.Id) {
                        cb(idOrEntity);
                    }
                    else {
                        quickbooks.getInvoice(idOrEntity, (e, inv) => cb(inv));
                    }
                };
                getEntity((invoiceEntity) => {
                    if (!invoiceEntity || !invoiceEntity.Id) {
                        resolve({
                            result: null,
                            isError: true,
                            error: formatError(originalError || "Unable to retrieve invoice for void operation"),
                        });
                        return;
                    }
                    // Void the invoice by setting PrivateNote and using sparse update
                    const voidedEntity = {
                        Id: invoiceEntity.Id,
                        SyncToken: invoiceEntity.SyncToken,
                        sparse: true,
                        PrivateNote: "Voided via API",
                    };
                    quickbooks.voidInvoice(voidedEntity, (err, resp) => {
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
        return { result: null, isError: true, error: formatError(error) };
    }
}
