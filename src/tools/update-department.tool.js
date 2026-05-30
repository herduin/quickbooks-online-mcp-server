import { updateQuickbooksDepartment } from "../handlers/update-quickbooks-department.handler.js";
import { z } from "zod";
const toolName = "update_department";
const toolDescription = "Update an existing department in QuickBooks Online.";
const toolSchema = z.object({
    id: z.string().min(1).describe("Department ID"),
    sync_token: z.string().min(1).describe("Sync token for concurrency"),
    name: z.string().optional().describe("Updated department name"),
    active: z.boolean().optional().describe("Whether department is active"),
});
const toolHandler = async ({ params }) => {
    const response = await updateQuickbooksDepartment(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Department updated:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const UpdateDepartmentTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
