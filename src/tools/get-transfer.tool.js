import { getQuickbooksTransfer } from "../handlers/get-quickbooks-transfer.handler.js";
import { z } from "zod";
const toolName = "get_transfer";
const toolDescription = "Get a transfer by ID from QuickBooks Online.";
const toolSchema = z.object({ id: z.string().min(1).describe("Transfer ID") });
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksTransfer(params.id);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Transfer found:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetTransferTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
