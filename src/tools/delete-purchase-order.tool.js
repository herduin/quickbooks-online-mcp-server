import { deleteQuickbooksPurchaseOrder } from "../handlers/delete-quickbooks-purchase-order.handler.js";
import { z } from "zod";
const toolName = "delete_purchase_order";
const toolDescription = "Delete a purchase order in QuickBooks Online.";
const toolSchema = z.object({ idOrEntity: z.any() });
const toolHandler = async (args) => {
    const response = await deleteQuickbooksPurchaseOrder(args.params.idOrEntity);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error deleting purchase order: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Purchase order deleted:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const DeletePurchaseOrderTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
