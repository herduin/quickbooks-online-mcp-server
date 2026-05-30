import { createQuickbooksAttachable } from "../handlers/create-quickbooks-attachable.handler.js";
import { z } from "zod";
const toolName = "create_attachable";
const toolDescription = "Create a new attachable (file attachment reference) in QuickBooks Online.";
const toolSchema = z.object({
    file_name: z.string().min(1).describe("File name"),
    note: z.string().optional().describe("Note about the attachment"),
    category: z.string().optional().describe("Attachment category"),
    content_type: z.string().optional().describe("MIME content type"),
    attachable_ref: z.object({
        entity_ref_type: z.string().describe("Entity type (e.g., 'Invoice', 'Bill')"),
        entity_ref_value: z.string().describe("Entity ID to attach to"),
    }).optional().describe("Reference to entity to attach to"),
});
const toolHandler = async ({ params }) => {
    const response = await createQuickbooksAttachable(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Attachable created:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const CreateAttachableTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
