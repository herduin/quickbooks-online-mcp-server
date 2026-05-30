import { updateQuickbooksBillPayment } from "../handlers/update-quickbooks-bill-payment.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "update_bill_payment";
const toolDescription = "Update a bill payment in QuickBooks Online.";
// Define the expected input schema for updating a bill payment
const toolSchema = z.object({
    billPayment: z.any(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await updateQuickbooksBillPayment(args.params.billPayment);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error updating bill payment: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Bill payment updated:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const UpdateBillPaymentTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
