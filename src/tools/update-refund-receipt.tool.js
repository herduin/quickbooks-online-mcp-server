import { updateQuickbooksRefundReceipt } from "../handlers/update-quickbooks-refund-receipt.handler.js";
import { z } from "zod";
const toolName = "update_refund_receipt";
const toolDescription = "Update an existing refund receipt in QuickBooks Online.";
const toolSchema = z.object({
    id: z.string().min(1).describe("Refund Receipt ID"),
    sync_token: z.string().min(1).describe("Sync token for optimistic locking"),
    customer_ref: z.string().optional().describe("Customer ID"),
    private_note: z.string().optional().describe("Private note"),
    doc_number: z.string().optional().describe("Document number"),
});
const toolHandler = async ({ params }) => {
    const response = await updateQuickbooksRefundReceipt(params);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error updating refund receipt: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Refund receipt updated successfully:` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const UpdateRefundReceiptTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
