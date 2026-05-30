import { searchQuickbooksTerms } from "../handlers/search-quickbooks-terms.handler.js";
import { z } from "zod";
const toolName = "search_terms";
const toolDescription = "Search for payment terms in QuickBooks Online with optional filters.";
const toolSchema = z.object({
    name: z.string().optional().describe("Filter by term name"),
    active: z.boolean().optional().describe("Filter by active status"),
    limit: z.number().optional().describe("Maximum results to return"),
});
const toolHandler = async ({ params }) => {
    const response = await searchQuickbooksTerms(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Found ${response.result.length} terms:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const SearchTermsTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
