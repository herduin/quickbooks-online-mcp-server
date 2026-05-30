import { searchQuickbooksRefundReceipts } from "../handlers/search-quickbooks-refund-receipts.handler.js";
import { z } from "zod";
const toolName = "search_refund_receipts";
const toolDescription = "Search for refund receipts in QuickBooks Online.";
const toolSchema = z.object({
    customer_ref: z.string().optional().describe("Filter by customer ID"),
    txn_date_from: z.string().optional().describe("Filter by date from (YYYY-MM-DD)"),
    txn_date_to: z.string().optional().describe("Filter by date to (YYYY-MM-DD)"),
    limit: z.number().optional().describe("Maximum results to return"),
});
const toolHandler = async ({ params }) => {
    const response = await searchQuickbooksRefundReceipts(params);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error searching refund receipts: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Found ${response.result.length} refund receipt(s):` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const SearchRefundReceiptsTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
