import { deleteQuickbooksItem } from "../handlers/delete-quickbooks-item.handler.js";
import { z } from "zod";
const toolName = "delete_item";
const toolDescription = "Delete (make inactive) an item in QuickBooks Online.";
const toolSchema = z.object({ idOrEntity: z.any() });
const toolHandler = async (args) => {
    const response = await deleteQuickbooksItem(args.params.idOrEntity);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error deleting item: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Item deleted (made inactive):` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const DeleteItemTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
