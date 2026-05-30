import { createQuickbooksSalesReceipt } from "../handlers/create-quickbooks-sales-receipt.handler.js";
import { z } from "zod";
const toolName = "create_sales_receipt";
const toolDescription = "Create a sales receipt (immediate payment sale) in QuickBooks Online.";
const lineItemSchema = z.object({
    item_ref: z.string().min(1).describe("Item ID"),
    qty: z.number().positive().describe("Quantity"),
    unit_price: z.number().nonnegative().describe("Unit price"),
    description: z.string().optional().describe("Line description"),
});
const toolSchema = z.object({
    customer_ref: z.string().min(1).describe("Customer ID"),
    line_items: z.array(lineItemSchema).min(1).describe("Line items"),
    payment_method_ref: z.string().optional().describe("Payment method ID"),
    deposit_to_account_ref: z.string().optional().describe("Account to deposit to"),
    txn_date: z.string().optional().describe("Transaction date (YYYY-MM-DD)"),
    doc_number: z.string().optional().describe("Document number"),
    private_note: z.string().optional().describe("Private note"),
});
const toolHandler = async ({ params }) => {
    const response = await createQuickbooksSalesReceipt(params);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error creating sales receipt: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Sales receipt created successfully:` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const CreateSalesReceiptTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
