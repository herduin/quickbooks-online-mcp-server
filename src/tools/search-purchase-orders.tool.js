import { searchQuickbooksPurchaseOrders } from "../handlers/search-quickbooks-purchase-orders.handler.js";
import { z } from "zod";
const toolName = "search_purchase_orders";
const toolDescription = "Search for purchase orders in QuickBooks Online.";
const toolSchema = z.object({
    vendor_ref: z.string().optional().describe("Filter by vendor ID"),
    txn_date_from: z.string().optional().describe("Filter by date from (YYYY-MM-DD)"),
    txn_date_to: z.string().optional().describe("Filter by date to (YYYY-MM-DD)"),
    limit: z.number().optional().describe("Maximum results to return"),
});
const toolHandler = async ({ params }) => {
    const response = await searchQuickbooksPurchaseOrders(params);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error searching purchase orders: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Found ${response.result.length} purchase order(s):` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const SearchPurchaseOrdersTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
