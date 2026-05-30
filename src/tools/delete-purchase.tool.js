import { deleteQuickbooksPurchase } from "../handlers/delete-quickbooks-purchase.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "delete_purchase";
const toolDescription = "Delete (make inactive) a purchase in QuickBooks Online.";
// Define the expected input schema for deleting a purchase
const toolSchema = z.object({
    idOrEntity: z.any(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await deleteQuickbooksPurchase(args.params.idOrEntity);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error deleting purchase: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Purchase deleted:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const DeletePurchaseTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
