import { getQuickbooksEmployee } from "../handlers/get-quickbooks-employee.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "get_employee";
const toolDescription = "Get an employee by Id from QuickBooks Online.";
// Define the expected input schema for getting an employee
const toolSchema = z.object({
    id: z.string(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await getQuickbooksEmployee(args.params.id);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error getting employee: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Employee retrieved:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const GetEmployeeTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
