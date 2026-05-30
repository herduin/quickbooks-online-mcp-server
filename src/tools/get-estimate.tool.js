import { getQuickbooksEstimate } from "../handlers/get-quickbooks-estimate.handler.js";
import { z } from "zod";
const toolName = "get_estimate";
const toolDescription = "Get an estimate by Id from QuickBooks Online.";
const toolSchema = z.object({ id: z.string() });
const toolHandler = async (args) => {
    const response = await getQuickbooksEstimate(args.params.id);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error getting estimate: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Estimate:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const GetEstimateTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
