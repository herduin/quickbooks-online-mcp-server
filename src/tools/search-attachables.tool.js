import { searchQuickbooksAttachables } from "../handlers/search-quickbooks-attachables.handler.js";
import { z } from "zod";
const toolName = "search_attachables";
const toolDescription = "Search for attachables in QuickBooks Online with optional filters.";
const toolSchema = z.object({
    file_name: z.string().optional().describe("Filter by file name"),
    content_type: z.string().optional().describe("Filter by content type"),
    limit: z.number().optional().describe("Maximum results to return"),
});
const toolHandler = async ({ params }) => {
    const response = await searchQuickbooksAttachables(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Found ${response.result.length} attachables:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const SearchAttachablesTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
