import { getQuickbooksTrialBalance } from "../handlers/get-quickbooks-trial-balance.handler.js";
import { z } from "zod";
const toolName = "get_trial_balance";
const toolDescription = "Generate a Trial Balance report from QuickBooks Online showing all account balances.";
const toolSchema = z.object({
    start_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    end_date: z.string().optional().describe("End date (YYYY-MM-DD)"),
    accounting_method: z.enum(["Cash", "Accrual"]).optional().describe("Accounting method"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksTrialBalance(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Trial Balance Report:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetTrialBalanceTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
