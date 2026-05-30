import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function createQuickbooksPurchaseOrder(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const payload = {
            VendorRef: { value: data.vendor_ref },
            Line: data.line_items.map((l, idx) => ({
                Id: `${idx + 1}`,
                LineNum: idx + 1,
                Description: l.description || undefined,
                Amount: l.qty * l.unit_price,
                DetailType: "ItemBasedExpenseLineDetail",
                ItemBasedExpenseLineDetail: {
                    ItemRef: { value: l.item_ref },
                    Qty: l.qty,
                    UnitPrice: l.unit_price,
                },
            })),
        };
        if (data.txn_date)
            payload.TxnDate = data.txn_date;
        if (data.doc_number)
            payload.DocNumber = data.doc_number;
        if (data.private_note)
            payload.PrivateNote = data.private_note;
        if (data.ship_addr) {
            payload.ShipAddr = {
                Line1: data.ship_addr.line1,
                City: data.ship_addr.city,
                CountrySubDivisionCode: data.ship_addr.country_sub_division_code,
                PostalCode: data.ship_addr.postal_code,
            };
        }
        return new Promise((resolve) => {
            quickbooks.createPurchaseOrder(payload, (err, created) => {
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
