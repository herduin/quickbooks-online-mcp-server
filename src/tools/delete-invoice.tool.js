import { deleteQuickbooksInvoice } from "../handlers/delete-quickbooks-invoice.handler.js";
import { z } from "zod";
const toolName = "delete_invoice";
const toolDescription = "Delete (void) an invoice in QuickBooks Online.";
const toolSchema = z.object({ idOrEntity: z.any() });
const toolHandler = async (args) => {
    const response = await deleteQuickbooksInvoice(args.params.idOrEntity);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error deleting invoice: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Invoice deleted (voided):` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const DeleteInvoiceTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
