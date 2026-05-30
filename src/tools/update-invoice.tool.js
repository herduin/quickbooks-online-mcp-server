import { updateQuickbooksInvoice } from "../handlers/update-quickbooks-invoice.handler.js";
import { z } from "zod";
const toolName = "update_invoice";
const toolDescription = "Update an existing invoice in Quickbooks by ID (sparse update).";
const toolSchema = z.object({
    invoice_id: z.string().min(1),
    patch: z.record(z.any()),
});
const toolHandler = async ({ params }) => {
    const response = await updateQuickbooksInvoice(params);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error updating invoice: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Invoice updated successfully:` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const UpdateInvoiceTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
