import { createQuickbooksClass } from "../handlers/create-quickbooks-class.handler.js";
import { z } from "zod";
const toolName = "create_class";
const toolDescription = "Create a new class in QuickBooks Online for categorizing transactions.";
const toolSchema = z.object({
    name: z.string().min(1).describe("Class name"),
    parent_ref: z.string().optional().describe("Parent class ID for sub-classes"),
});
const toolHandler = async ({ params }) => {
    const response = await createQuickbooksClass(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Class created:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const CreateClassTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
