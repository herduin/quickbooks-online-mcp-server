import { getQuickbooksTimeActivity } from "../handlers/get-quickbooks-time-activity.handler.js";
import { z } from "zod";
const toolName = "get_time_activity";
const toolDescription = "Get a time activity by ID from QuickBooks Online.";
const toolSchema = z.object({ id: z.string().min(1).describe("Time Activity ID") });
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksTimeActivity(params.id);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Time activity found:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetTimeActivityTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
