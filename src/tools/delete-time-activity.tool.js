import { deleteQuickbooksTimeActivity } from "../handlers/delete-quickbooks-time-activity.handler.js";
import { z } from "zod";
const toolName = "delete_time_activity";
const toolDescription = "Delete a time activity in QuickBooks Online.";
const toolSchema = z.object({ idOrEntity: z.any() });
const toolHandler = async (args) => {
    const response = await deleteQuickbooksTimeActivity(args.params.idOrEntity);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Time activity deleted:` }, { type: "text", text: JSON.stringify(response.result) }] };
};
export const DeleteTimeActivityTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
