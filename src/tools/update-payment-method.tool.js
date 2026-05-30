import { updateQuickbooksPaymentMethod } from "../handlers/update-quickbooks-payment-method.handler.js";
import { z } from "zod";
const toolName = "update_payment_method";
const toolDescription = "Update an existing payment method in QuickBooks Online.";
const toolSchema = z.object({
    id: z.string().min(1).describe("Payment method ID"),
    sync_token: z.string().min(1).describe("Sync token for concurrency"),
    name: z.string().optional().describe("Updated payment method name"),
    active: z.boolean().optional().describe("Whether payment method is active"),
});
const toolHandler = async ({ params }) => {
    const response = await updateQuickbooksPaymentMethod(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Payment method updated:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const UpdatePaymentMethodTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
