import { getQuickbooksCustomer } from "../handlers/get-quickbooks-customer.handler.js";
import { z } from "zod";
const toolName = "get_customer";
const toolDescription = "Get a customer by Id from QuickBooks Online.";
const toolSchema = z.object({ id: z.string() });
const toolHandler = async (args) => {
    const params = args.params;
    const response = await getQuickbooksCustomer(params.id);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error getting customer: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Customer:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const GetCustomerTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
