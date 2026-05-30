import { deleteQuickbooksEstimate } from "../handlers/delete-quickbooks-estimate.handler.js";
import { z } from "zod";
const toolName = "delete_estimate";
const toolDescription = "Delete (void) an estimate in QuickBooks Online.";
const toolSchema = z.object({ idOrEntity: z.any() });
const toolHandler = async (args) => {
    const response = await deleteQuickbooksEstimate(args.params.idOrEntity);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error deleting estimate: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Estimate deleted:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const DeleteEstimateTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
