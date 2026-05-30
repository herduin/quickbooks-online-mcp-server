import { updateQuickbooksCustomer } from "../handlers/update-quickbooks-customer.handler.js";
import { z } from "zod";
const toolName = "update_customer";
const toolDescription = "Update an existing customer in QuickBooks Online.";
const toolSchema = z.object({ customer: z.any() });
const toolHandler = async (args) => {
    const response = await updateQuickbooksCustomer(args.params.customer);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error updating customer: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Customer updated:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const UpdateCustomerTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
