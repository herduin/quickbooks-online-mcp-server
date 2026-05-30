import { getQuickbooksBill } from "../handlers/get-quickbooks-bill.handler.js";
import { z } from "zod";
const toolName = "get-bill";
const toolDescription = "Get a bill by ID from QuickBooks Online.";
const toolSchema = z.object({
    id: z.string(),
});
const toolHandler = async (args) => {
    const response = await getQuickbooksBill(args.params.id);
    if (response.isError) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error getting bill: ${response.error}`,
                },
            ],
        };
    }
    const bill = response.result;
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(bill),
            }
        ],
    };
};
export const GetBillTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
