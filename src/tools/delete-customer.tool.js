import { deleteQuickbooksCustomer } from "../handlers/delete-quickbooks-customer.handler.js";
import { z } from "zod";
const toolName = "delete_customer";
const toolDescription = "Delete (make inactive) a customer in QuickBooks Online.";
const toolSchema = z.object({ idOrEntity: z.any() });
const toolHandler = async (args) => {
    const response = await deleteQuickbooksCustomer(args.params.idOrEntity);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error deleting customer: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Customer deleted:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const DeleteCustomerTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
