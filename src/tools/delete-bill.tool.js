import { deleteQuickbooksBill } from "../handlers/delete-quickbooks-bill.handler.js";
import { z } from "zod";
const toolName = "delete-bill";
const toolDescription = "Delete a bill in QuickBooks Online.";
const toolSchema = z.object({
    bill: z.object({
        Id: z.string(),
        SyncToken: z.string(),
    }),
});
const toolHandler = async (args) => {
    const response = await deleteQuickbooksBill(args.params.bill);
    if (response.isError) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error deleting bill: ${response.error}`,
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
export const DeleteBillTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
