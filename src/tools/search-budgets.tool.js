import { searchQuickbooksBudgets } from "../handlers/search-quickbooks-budgets.handler.js";
import { z } from "zod";
const toolName = "search_budgets";
const toolDescription = "Search for budgets in QuickBooks Online. Returns Budget records with nested BudgetDetail line items (Amount, BudgetDate, AccountRef, ClassRef, CustomerRef, DepartmentRef, LocationRef). Budget is read-only in the QBO v3 API.";
const toolSchema = z.object({
    name: z.string().optional().describe("Filter by budget name"),
    active: z.boolean().optional().describe("Filter by active status"),
    limit: z.number().optional().describe("Maximum results to return"),
});
const toolHandler = async ({ params }) => {
    const response = await searchQuickbooksBudgets(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Found ${response.result.length} budgets:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const SearchBudgetsTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
