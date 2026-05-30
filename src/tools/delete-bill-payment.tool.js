import { deleteQuickbooksBillPayment } from "../handlers/delete-quickbooks-bill-payment.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "delete_bill_payment";
const toolDescription = "Delete (make inactive) a bill payment in QuickBooks Online.";
// Define the expected input schema for deleting a bill payment
const toolSchema = z.object({
    idOrEntity: z.any(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await deleteQuickbooksBillPayment(args.params.idOrEntity);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error deleting bill payment: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Bill payment deleted:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const DeleteBillPaymentTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
