import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
// Primitive field type map (based on Quickbooks Invoice entity reference docs)
const invoiceFieldTypeMap = {
    DocNumber: "string",
    TxnDate: "string",
    PrivateNote: "string",
    GlobalTaxCalculation: "string",
    ApplyTaxAfterDiscount: "boolean",
    TotalAmt: "number",
};
/**
 * Coerce primitive invoice fields to the expected QuickBooks Online types.
 */
function normalizeInvoiceFields(obj) {
    const normalized = { ...obj };
    for (const [key, value] of Object.entries(obj)) {
        if (value === undefined || value === null)
            continue;
        const expected = invoiceFieldTypeMap[key];
        if (!expected)
            continue; // skip if not a primitive field we validate
        switch (expected) {
            case "string":
                normalized[key] = String(value);
                break;
            case "number":
                normalized[key] = typeof value === "number" ? value : Number(value);
                break;
            case "boolean":
                normalized[key] = typeof value === "boolean" ? value : value === "true";
                break;
        }
    }
    return normalized;
}
export async function createQuickbooksInvoice(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const invoicePayload = {
            CustomerRef: { value: data.customer_ref },
            Line: data.line_items.map((l, idx) => ({
                Id: `${idx + 1}`,
                LineNum: idx + 1,
                Description: l.description || undefined,
                Amount: l.qty * l.unit_price,
                DetailType: "SalesItemLineDetail",
                SalesItemLineDetail: {
                    ItemRef: { value: l.item_ref },
                    Qty: l.qty,
                    UnitPrice: l.unit_price,
                },
            })),
            DocNumber: data.doc_number,
            TxnDate: data.txn_date,
        };
        const normalizedPayload = normalizeInvoiceFields(invoicePayload);
        return new Promise((resolve) => {
            quickbooks.createInvoice(normalizedPayload, (err, created) => {
                if (err) {
                    resolve({ result: null, isError: true, error: formatError(err) });
                }
                else {
                    resolve({ result: created, isError: false, error: null });
                }
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
