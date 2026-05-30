import { searchQuickbooksDepartments } from "../handlers/search-quickbooks-departments.handler.js";
import { z } from "zod";
const toolName = "search_departments";
const toolDescription = "Search for departments in QuickBooks Online with optional filters.";
const toolSchema = z.object({
    name: z.string().optional().describe("Filter by department name"),
    active: z.boolean().optional().describe("Filter by active status"),
    limit: z.number().optional().describe("Maximum results to return"),
});
const toolHandler = async ({ params }) => {
    const response = await searchQuickbooksDepartments(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Found ${response.result.length} departments:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const SearchDepartmentsTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
