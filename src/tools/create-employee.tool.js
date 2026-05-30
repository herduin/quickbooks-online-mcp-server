import { createQuickbooksEmployee } from "../handlers/create-quickbooks-employee.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "create_employee";
const toolDescription = "Create an employee in QuickBooks Online.";
// Define the expected input schema for creating an employee
const toolSchema = z.object({
    employee: z.any(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await createQuickbooksEmployee(args.params.employee);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error creating employee: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Employee created:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const CreateEmployeeTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
