import { createQuickbooksPurchase } from "../handlers/create-quickbooks-purchase.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "create_purchase";
const toolDescription = "Create a purchase in QuickBooks Online.";
// Define the expected input schema for creating a purchase
const toolSchema = z.object({
    purchase: z.any(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await createQuickbooksPurchase(args.params.purchase);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error creating purchase: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Purchase created:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const CreatePurchaseTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
