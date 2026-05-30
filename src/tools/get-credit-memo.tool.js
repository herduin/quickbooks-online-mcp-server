import { getQuickbooksCreditMemo } from "../handlers/get-quickbooks-credit-memo.handler.js";
import { z } from "zod";
const toolName = "get_credit_memo";
const toolDescription = "Get a single credit memo by ID from QuickBooks Online.";
const toolSchema = z.object({
    id: z.string().min(1).describe("The QuickBooks Credit Memo ID"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksCreditMemo(params.id);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error getting credit memo: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Credit memo found:` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const GetCreditMemoTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
