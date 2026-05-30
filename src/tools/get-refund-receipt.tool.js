import { getQuickbooksRefundReceipt } from "../handlers/get-quickbooks-refund-receipt.handler.js";
import { z } from "zod";
const toolName = "get_refund_receipt";
const toolDescription = "Get a single refund receipt by ID from QuickBooks Online.";
const toolSchema = z.object({
    id: z.string().min(1).describe("The QuickBooks Refund Receipt ID"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksRefundReceipt(params.id);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error getting refund receipt: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Refund receipt found:` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const GetRefundReceiptTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
