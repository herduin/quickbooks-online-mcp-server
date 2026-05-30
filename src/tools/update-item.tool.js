import { updateQuickbooksItem } from "../handlers/update-quickbooks-item.handler.js";
import { z } from "zod";
const toolName = "update_item";
const toolDescription = "Update an existing item in Quickbooks by ID (sparse update).";
const toolSchema = z.object({
    item_id: z.string().min(1),
    patch: z.record(z.any()),
});
const toolHandler = async ({ params }) => {
    const response = await updateQuickbooksItem(params);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error updating item: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Item updated successfully:` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const UpdateItemTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
