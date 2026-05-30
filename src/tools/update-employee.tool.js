import { updateQuickbooksEmployee } from "../handlers/update-quickbooks-employee.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "update_employee";
const toolDescription = "Update an employee in QuickBooks Online.";
// Define the expected input schema for updating an employee
const toolSchema = z.object({
    employee: z.any(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await updateQuickbooksEmployee(args.params.employee);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error updating employee: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Employee updated:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const UpdateEmployeeTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
