import { updateQuickbooksEstimate } from "../handlers/update-quickbooks-estimate.handler.js";
import { z } from "zod";
const toolName = "update_estimate";
const toolDescription = "Update an estimate in QuickBooks Online.";
const toolSchema = z.object({ estimate: z.any() });
const toolHandler = async (args) => {
    const response = await updateQuickbooksEstimate(args.params.estimate);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error updating estimate: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Estimate updated:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const UpdateEstimateTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
