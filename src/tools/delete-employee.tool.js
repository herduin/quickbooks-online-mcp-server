import { deleteQuickbooksEmployee } from "../handlers/delete-quickbooks-employee.handler.js";
import { z } from "zod";
const toolName = "delete_employee";
const toolDescription = "Delete (make inactive) an employee in QuickBooks Online.";
const toolSchema = z.object({ idOrEntity: z.any() });
const toolHandler = async (args) => {
    const response = await deleteQuickbooksEmployee(args.params.idOrEntity);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error deleting employee: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Employee deleted (made inactive):` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const DeleteEmployeeTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
