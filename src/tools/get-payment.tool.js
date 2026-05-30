import { getQuickbooksPayment } from "../handlers/get-quickbooks-payment.handler.js";
import { z } from "zod";
const toolName = "get_payment";
const toolDescription = "Get a single payment by ID from QuickBooks Online.";
const toolSchema = z.object({
    id: z.string().min(1).describe("The QuickBooks Payment ID"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksPayment(params.id);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error getting payment: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Payment found:` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const GetPaymentTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
