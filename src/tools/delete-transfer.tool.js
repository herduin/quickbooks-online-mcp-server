import { deleteQuickbooksTransfer } from "../handlers/delete-quickbooks-transfer.handler.js";
import { z } from "zod";
const toolName = "delete_transfer";
const toolDescription = "Delete a transfer in QuickBooks Online.";
const toolSchema = z.object({ idOrEntity: z.any() });
const toolHandler = async (args) => {
    const response = await deleteQuickbooksTransfer(args.params.idOrEntity);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Transfer deleted:` }, { type: "text", text: JSON.stringify(response.result) }] };
};
export const DeleteTransferTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
