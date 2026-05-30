import { getQuickbooksVendorExpenses } from "../handlers/get-quickbooks-vendor-expenses.handler.js";
import { z } from "zod";
const toolName = "get_vendor_expenses";
const toolDescription = "Generate a Vendor Expenses report from QuickBooks Online showing expenses by vendor.";
const toolSchema = z.object({
    start_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    end_date: z.string().optional().describe("End date (YYYY-MM-DD)"),
    vendor: z.string().optional().describe("Filter by vendor ID"),
    summarize_column_by: z.enum(["Total", "Month", "Week", "Days"]).optional().describe("How to summarize columns"),
    accounting_method: z.enum(["Cash", "Accrual"]).optional().describe("Accounting method"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksVendorExpenses(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Vendor Expenses Report:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetVendorExpensesTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
