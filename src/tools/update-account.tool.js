import { updateQuickbooksAccount } from "../handlers/update-quickbooks-account.handler.js";
import { z } from "zod";
const toolName = "update_account";
const toolDescription = "Update an existing chart‑of‑accounts entry in Quickbooks.";
const toolSchema = z.object({
    account_id: z.string().min(1),
    patch: z.record(z.any()),
});
const toolHandler = async ({ params }) => {
    const response = await updateQuickbooksAccount(params);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error updating account: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Account updated successfully:` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const UpdateAccountTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
