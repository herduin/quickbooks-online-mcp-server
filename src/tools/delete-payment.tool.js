import { deleteQuickbooksPayment } from "../handlers/delete-quickbooks-payment.handler.js";
import { z } from "zod";
const toolName = "delete_payment";
const toolDescription = "Delete (void) a payment in QuickBooks Online.";
const toolSchema = z.object({ idOrEntity: z.any() });
const toolHandler = async (args) => {
    const response = await deleteQuickbooksPayment(args.params.idOrEntity);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error deleting payment: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Payment deleted:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const DeletePaymentTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
