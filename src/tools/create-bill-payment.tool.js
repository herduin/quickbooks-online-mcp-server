import { createQuickbooksBillPayment } from "../handlers/create-quickbooks-bill-payment.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "create_bill_payment";
const toolDescription = "Create a bill payment in QuickBooks Online.";
// Define the expected input schema for creating a bill payment
const toolSchema = z.object({
    billPayment: z.any(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await createQuickbooksBillPayment(args.params.billPayment);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error creating bill payment: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Bill payment created:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const CreateBillPaymentTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
