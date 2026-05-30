import { deleteQuickbooksCreditMemo } from "../handlers/delete-quickbooks-credit-memo.handler.js";
import { z } from "zod";
const toolName = "delete_credit_memo";
const toolDescription = "Delete (void) a credit memo in QuickBooks Online.";
const toolSchema = z.object({ idOrEntity: z.any() });
const toolHandler = async (args) => {
    const response = await deleteQuickbooksCreditMemo(args.params.idOrEntity);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error deleting credit memo: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Credit memo deleted:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const DeleteCreditMemoTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
