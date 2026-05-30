import { updateQuickbooksDeposit } from "../handlers/update-quickbooks-deposit.handler.js";
import { z } from "zod";
const toolName = "update_deposit";
const toolDescription = "Update a deposit in QuickBooks Online.";
const toolSchema = z.object({
    id: z.string().min(1).describe("Deposit ID"),
    sync_token: z.string().min(1).describe("Sync token"),
    private_note: z.string().optional().describe("Private note"),
});
const toolHandler = async ({ params }) => {
    const response = await updateQuickbooksDeposit(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Deposit updated:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const UpdateDepositTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
