import { createQuickbooksCustomer } from "../handlers/create-quickbooks-customer.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "create_customer";
const toolDescription = "Create a customer in QuickBooks Online.";
// Define the expected input schema for creating a customer
const toolSchema = z.object({
    customer: z.any(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await createQuickbooksCustomer(args.params.customer);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error creating customer: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Customer created:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const CreateCustomerTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
