import { getQuickbooksPurchase } from "../handlers/get-quickbooks-purchase.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "get_purchase";
const toolDescription = "Get a purchase by Id from QuickBooks Online.";
// Define the expected input schema for getting a purchase
const toolSchema = z.object({
    id: z.string(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await getQuickbooksPurchase(args.params.id);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error getting purchase: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Purchase retrieved:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const GetPurchaseTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
