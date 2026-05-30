import { getQuickbooksBillPayment } from "../handlers/get-quickbooks-bill-payment.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "get_bill_payment";
const toolDescription = "Get a bill payment by Id from QuickBooks Online.";
// Define the expected input schema for getting a bill payment
const toolSchema = z.object({
    id: z.string(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await getQuickbooksBillPayment(args.params.id);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error getting bill payment: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Bill payment retrieved:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const GetBillPaymentTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
