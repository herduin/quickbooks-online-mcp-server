import { readQuickbooksInvoice } from "../handlers/read-quickbooks-invoice.handler.js";
import { z } from "zod";
const toolName = "read_invoice";
const toolDescription = "Read a single invoice from QuickBooks Online by its ID.";
const toolSchema = z.object({
    invoice_id: z.string().min(1, { message: "Invoice ID is required" }),
});
const toolHandler = async ({ params }) => {
    const { invoice_id } = params;
    const response = await readQuickbooksInvoice(invoice_id);
    if (response.isError) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error reading invoice ${invoice_id}: ${response.error}`,
                },
            ],
        };
    }
    return {
        content: [
            {
                type: "text",
                text: `Invoice details for ID ${invoice_id}:`,
            },
            {
                type: "text",
                text: JSON.stringify(response.result, null, 2),
            },
        ],
    };
};
export const ReadInvoiceTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
