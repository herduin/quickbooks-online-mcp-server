import { searchQuickbooksDeposits } from "../handlers/search-quickbooks-deposits.handler.js";
import { z } from "zod";
const toolName = "search_deposits";
const toolDescription = "Search for deposits in QuickBooks Online.";
const toolSchema = z.object({
    txn_date_from: z.string().optional().describe("Filter by date from"),
    txn_date_to: z.string().optional().describe("Filter by date to"),
    limit: z.number().optional().describe("Maximum results"),
});
const toolHandler = async ({ params }) => {
    const response = await searchQuickbooksDeposits(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Found ${response.result.length} deposit(s):` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const SearchDepositsTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
