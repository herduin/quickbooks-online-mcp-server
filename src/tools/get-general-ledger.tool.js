import { getQuickbooksGeneralLedger } from "../handlers/get-quickbooks-general-ledger.handler.js";
import { z } from "zod";
const toolName = "get_general_ledger";
const toolDescription = "Generate a General Ledger report from QuickBooks Online showing detailed transaction history.";
const toolSchema = z.object({
    start_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    end_date: z.string().optional().describe("End date (YYYY-MM-DD)"),
    accounting_method: z.enum(["Cash", "Accrual"]).optional().describe("Accounting method"),
    account: z.string().optional().describe("Filter by account ID"),
    source_account: z.string().optional().describe("Filter by source account"),
    sort_by: z.string().optional().describe("Field to sort by"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksGeneralLedger(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `General Ledger Report:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetGeneralLedgerTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
