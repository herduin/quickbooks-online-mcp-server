import { createQuickbooksPaymentMethod } from "../handlers/create-quickbooks-payment-method.handler.js";
import { z } from "zod";
const toolName = "create_payment_method";
const toolDescription = "Create a new payment method in QuickBooks Online (e.g., Cash, Check, Credit Card).";
const toolSchema = z.object({
    name: z.string().min(1).describe("Payment method name"),
    type: z.enum(["CREDIT_CARD", "NON_CREDIT_CARD"]).optional().describe("Payment method type"),
});
const toolHandler = async ({ params }) => {
    const response = await createQuickbooksPaymentMethod(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Payment method created:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const CreatePaymentMethodTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
