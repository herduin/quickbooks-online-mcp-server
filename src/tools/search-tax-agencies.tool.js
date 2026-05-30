import { searchQuickbooksTaxAgencies } from "../handlers/search-quickbooks-tax-agencies.handler.js";
import { z } from "zod";
const toolName = "search_tax_agencies";
const toolDescription = "Search for tax agencies in QuickBooks Online with optional filters.";
const toolSchema = z.object({
    name: z.string().optional().describe("Filter by tax agency name"),
    limit: z.number().optional().describe("Maximum results to return"),
});
const toolHandler = async ({ params }) => {
    const response = await searchQuickbooksTaxAgencies(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Found ${response.result.length} tax agencies:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const SearchTaxAgenciesTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
