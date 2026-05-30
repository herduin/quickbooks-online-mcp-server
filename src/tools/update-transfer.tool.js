import { updateQuickbooksTransfer } from "../handlers/update-quickbooks-transfer.handler.js";
import { z } from "zod";
const toolName = "update_transfer";
const toolDescription = "Update a transfer in QuickBooks Online.";
const toolSchema = z.object({
    id: z.string().min(1).describe("Transfer ID"),
    sync_token: z.string().min(1).describe("Sync token"),
    from_account_ref: z.string().optional().describe("Source account ID"),
    to_account_ref: z.string().optional().describe("Destination account ID"),
    amount: z.number().optional().describe("Transfer amount"),
    private_note: z.string().optional().describe("Private note"),
});
const toolHandler = async ({ params }) => {
    const response = await updateQuickbooksTransfer(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Transfer updated:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const UpdateTransferTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
