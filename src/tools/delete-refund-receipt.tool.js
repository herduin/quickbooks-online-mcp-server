import { deleteQuickbooksRefundReceipt } from "../handlers/delete-quickbooks-refund-receipt.handler.js";
import { z } from "zod";
const toolName = "delete_refund_receipt";
const toolDescription = "Delete (void) a refund receipt in QuickBooks Online.";
const toolSchema = z.object({ idOrEntity: z.any() });
const toolHandler = async (args) => {
    const response = await deleteQuickbooksRefundReceipt(args.params.idOrEntity);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error deleting refund receipt: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Refund receipt deleted:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const DeleteRefundReceiptTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
