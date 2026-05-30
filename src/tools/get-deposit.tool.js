import { getQuickbooksDeposit } from "../handlers/get-quickbooks-deposit.handler.js";
import { z } from "zod";
const toolName = "get_deposit";
const toolDescription = "Get a deposit by ID from QuickBooks Online.";
const toolSchema = z.object({ id: z.string().min(1).describe("Deposit ID") });
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksDeposit(params.id);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Deposit found:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetDepositTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
