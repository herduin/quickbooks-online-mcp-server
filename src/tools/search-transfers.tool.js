import { searchQuickbooksTransfers } from "../handlers/search-quickbooks-transfers.handler.js";
import { z } from "zod";
const toolName = "search_transfers";
const toolDescription = "Search for transfers in QuickBooks Online.";
const toolSchema = z.object({
    txn_date_from: z.string().optional().describe("Filter by date from"),
    txn_date_to: z.string().optional().describe("Filter by date to"),
    limit: z.number().optional().describe("Maximum results"),
});
const toolHandler = async ({ params }) => {
    const response = await searchQuickbooksTransfers(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Found ${response.result.length} transfer(s):` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const SearchTransfersTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
