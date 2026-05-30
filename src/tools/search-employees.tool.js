import { searchQuickbooksEmployees } from "../handlers/search-quickbooks-employees.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "search_employees";
const toolDescription = "Search employees in QuickBooks Online that match given criteria.";
// Define the expected input schema for searching employees
const toolSchema = z.object({
    criteria: z.array(z.object({
        field: z.string().describe("Employee field to filter on (e.g. DisplayName, GivenName, FamilyName, Active, MetaData.CreateTime)"),
        value: z.union([z.string(), z.number(), z.boolean()]).describe("Value to match"),
        operator: z.enum(["=", "<", ">", "<=", ">=", "LIKE", "IN"]).optional().describe("Comparison operator, defaults to ="),
    })).optional().describe("Array of filter conditions. Omit to fetch all employees."),
    asc: z.string().optional().describe("Field to sort ascending"),
    desc: z.string().optional().describe("Field to sort descending"),
    limit: z.number().optional().describe("Maximum results to return"),
    offset: z.number().optional().describe("Number of results to skip"),
    count: z.boolean().optional().describe("Return only the count of matching records"),
    fetchAll: z.boolean().optional().describe("Fetch all results ignoring limit/offset"),
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
