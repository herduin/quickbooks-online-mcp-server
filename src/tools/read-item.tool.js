import { readQuickbooksItem } from "../handlers/read-quickbooks-item.handler.js";
import { z } from "zod";
const toolName = "read_item";
const toolDescription = "Read a single item in QuickBooks Online by its ID.";
const toolSchema = z.object({
    item_id: z.string().min(1, { message: "Item ID is required" }),
});
const toolHandler = async ({ params }) => {
    const { item_id } = params;
    const response = await readQuickbooksItem(item_id);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error reading item ${item_id}: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Item details for ID ${item_id}:` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const ReadItemTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
