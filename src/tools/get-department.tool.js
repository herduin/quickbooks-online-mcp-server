import { getQuickbooksDepartment } from "../handlers/get-quickbooks-department.handler.js";
import { z } from "zod";
const toolName = "get_department";
const toolDescription = "Retrieve a specific department from QuickBooks Online by ID.";
const toolSchema = z.object({
    id: z.string().min(1).describe("Department ID"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksDepartment(params.id);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetDepartmentTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
