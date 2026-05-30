import { deleteQuickbooksDeposit } from "../handlers/delete-quickbooks-deposit.handler.js";
import { z } from "zod";
const toolName = "delete_deposit";
const toolDescription = "Delete a deposit in QuickBooks Online.";
const toolSchema = z.object({ idOrEntity: z.any() });
const toolHandler = async (args) => {
    const response = await deleteQuickbooksDeposit(args.params.idOrEntity);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Deposit deleted:` }, { type: "text", text: JSON.stringify(response.result) }] };
};
export const DeleteDepositTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
