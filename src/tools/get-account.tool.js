import { getQuickbooksAccount } from "../handlers/get-quickbooks-account.handler.js";
import { z } from "zod";
const toolName = "get_account";
const toolDescription = "Get a single account by ID from QuickBooks Online.";
const toolSchema = z.object({
    id: z.string().min(1).describe("The QuickBooks Account ID"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksAccount(params.id);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error getting account: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Account found:` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const GetAccountTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
