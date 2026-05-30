import { searchQuickbooksTimeActivities } from "../handlers/search-quickbooks-time-activities.handler.js";
import { z } from "zod";
const toolName = "search_time_activities";
const toolDescription = "Search for time activities in QuickBooks Online.";
const toolSchema = z.object({
    employee_ref: z.string().optional().describe("Filter by employee ID"),
    vendor_ref: z.string().optional().describe("Filter by vendor ID"),
    customer_ref: z.string().optional().describe("Filter by customer ID"),
    txn_date_from: z.string().optional().describe("Filter by date from"),
    txn_date_to: z.string().optional().describe("Filter by date to"),
    limit: z.number().optional().describe("Maximum results"),
});
const toolHandler = async ({ params }) => {
    const response = await searchQuickbooksTimeActivities(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Found ${response.result.length} time activity(ies):` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const SearchTimeActivitiesTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
