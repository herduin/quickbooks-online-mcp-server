import { getQuickbooksAttachable } from "../handlers/get-quickbooks-attachable.handler.js";
import { z } from "zod";
const toolName = "get_attachable";
const toolDescription = "Retrieve a specific attachable from QuickBooks Online by ID.";
const toolSchema = z.object({
    id: z.string().min(1).describe("Attachable ID"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksAttachable(params.id);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetAttachableTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
