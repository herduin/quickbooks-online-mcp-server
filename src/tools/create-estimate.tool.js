import { createQuickbooksEstimate } from "../handlers/create-quickbooks-estimate.handler.js";
import { z } from "zod";
const toolName = "create_estimate";
const toolDescription = "Create an estimate in QuickBooks Online.";
const toolSchema = z.object({ estimate: z.any() });
const toolHandler = async (args) => {
    const response = await createQuickbooksEstimate(args.params.estimate);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error creating estimate: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Estimate created:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const CreateEstimateTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
