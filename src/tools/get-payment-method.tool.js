import { getQuickbooksPaymentMethod } from "../handlers/get-quickbooks-payment-method.handler.js";
import { z } from "zod";
const toolName = "get_payment_method";
const toolDescription = "Retrieve a specific payment method from QuickBooks Online by ID.";
const toolSchema = z.object({
    id: z.string().min(1).describe("Payment method ID"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksPaymentMethod(params.id);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetPaymentMethodTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
