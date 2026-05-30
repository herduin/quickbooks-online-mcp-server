import { createQuickbooksAccount } from "../handlers/create-quickbooks-account.handler.js";
import { z } from "zod";
const toolName = "create_account";
const toolDescription = "Create a chart‑of‑accounts entry in QuickBooks Online.";
const toolSchema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    sub_type: z.string().optional(),
    description: z.string().optional(),
});
const toolHandler = async ({ params }) => {
    const response = await createQuickbooksAccount(params);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error creating account: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Account created successfully:` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const CreateAccountTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
