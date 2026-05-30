import { updateQuickbooksAttachable } from "../handlers/update-quickbooks-attachable.handler.js";
import { z } from "zod";
const toolName = "update_attachable";
const toolDescription = "Update an existing attachable in QuickBooks Online.";
const toolSchema = z.object({
    id: z.string().min(1).describe("Attachable ID"),
    sync_token: z.string().min(1).describe("Sync token for concurrency"),
    file_name: z.string().optional().describe("Updated file name"),
    note: z.string().optional().describe("Updated note"),
    category: z.string().optional().describe("Updated category"),
});
const toolHandler = async ({ params }) => {
    const response = await updateQuickbooksAttachable(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Attachable updated:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const UpdateAttachableTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
