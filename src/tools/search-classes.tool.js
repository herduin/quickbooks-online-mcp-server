import { searchQuickbooksClasses } from "../handlers/search-quickbooks-classes.handler.js";
import { z } from "zod";
const toolName = "search_classes";
const toolDescription = "Search for classes in QuickBooks Online with optional filters.";
const toolSchema = z.object({
    name: z.string().optional().describe("Filter by class name"),
    active: z.boolean().optional().describe("Filter by active status"),
    limit: z.number().optional().describe("Maximum results to return"),
});
const toolHandler = async ({ params }) => {
    const response = await searchQuickbooksClasses(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Found ${response.result.length} classes:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const SearchClassesTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
