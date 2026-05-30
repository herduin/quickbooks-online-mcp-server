import { searchQuickbooksEmployees } from "../handlers/search-quickbooks-employees.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "search_employees";
const toolDescription = "Search employees in QuickBooks Online that match given criteria.";
// Define the expected input schema for searching employees
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
    const response = await searchQuickbooksEmployees(args.params);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error searching employees: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Employees found:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const SearchEmployeesTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
