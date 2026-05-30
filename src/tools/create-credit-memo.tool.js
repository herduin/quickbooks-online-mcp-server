import { createQuickbooksCreditMemo } from "../handlers/create-quickbooks-credit-memo.handler.js";
import { z } from "zod";
const toolName = "create_credit_memo";
const toolDescription = "Create a credit memo (customer credit) in QuickBooks Online.";
const lineItemSchema = z.object({
    item_ref: z.string().min(1).describe("Item ID"),
    qty: z.number().positive().describe("Quantity"),
    unit_price: z.number().nonnegative().describe("Unit price"),
    description: z.string().optional().describe("Line description"),
});
const toolSchema = z.object({
    customer_ref: z.string().min(1).describe("Customer ID"),
    line_items: z.array(lineItemSchema).min(1).describe("Line items"),
    txn_date: z.string().optional().describe("Transaction date (YYYY-MM-DD)"),
    doc_number: z.string().optional().describe("Document number"),
    private_note: z.string().optional().describe("Private note"),
});
const toolHandler = async ({ params }) => {
    const response = await createQuickbooksCreditMemo(params);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error creating credit memo: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Credit memo created successfully:` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const CreateCreditMemoTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
