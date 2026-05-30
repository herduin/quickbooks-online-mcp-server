import { getQuickbooksCustomerBalance } from "../handlers/get-quickbooks-customer-balance.handler.js";
import { z } from "zod";
const toolName = "get_customer_balance";
const toolDescription = "Generate a Customer Balance report from QuickBooks Online showing outstanding balances by customer.";
const toolSchema = z.object({
    report_date: z.string().optional().describe("Report date (YYYY-MM-DD)"),
    customer: z.string().optional().describe("Filter by customer ID"),
    summarize_column_by: z.enum(["Total", "Month", "Week", "Days"]).optional().describe("How to summarize columns"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksCustomerBalance(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Customer Balance Report:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetCustomerBalanceTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
