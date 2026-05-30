import { searchQuickbooksPurchases } from "../handlers/search-quickbooks-purchases.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "search_purchases";
const toolDescription = "Search purchases in QuickBooks Online that match given criteria.";
// Define the expected input schema for searching purchases
const toolSchema = z.object({
    criteria: z.array(z.any()).optional(),
    asc: z.string().optional(),
    desc: z.string().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
    count: z.boolean().optional(),
    fetchAll: z.boolean().optional(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await searchQuickbooksPurchases(args.params);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error searching purchases: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Purchases found:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const SearchPurchasesTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
