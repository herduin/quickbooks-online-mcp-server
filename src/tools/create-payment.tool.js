import { createQuickbooksPayment } from "../handlers/create-quickbooks-payment.handler.js";
import { z } from "zod";
const toolName = "create_payment";
const toolDescription = "Create a payment (receive money from customer) in QuickBooks Online.";
const linkedTxnSchema = z.object({
    txn_id: z.string().describe("Transaction ID to apply payment to"),
    txn_type: z.string().describe("Transaction type (e.g., Invoice)"),
});
const lineSchema = z.object({
    amount: z.number().describe("Amount to apply to this transaction"),
    linked_txn: z.array(linkedTxnSchema).describe("Linked transactions"),
});
const toolSchema = z.object({
    customer_ref: z.string().min(1).describe("Customer ID"),
    total_amt: z.number().positive().describe("Total payment amount"),
    payment_method_ref: z.string().optional().describe("Payment method ID"),
    deposit_to_account_ref: z.string().optional().describe("Account to deposit to"),
    txn_date: z.string().optional().describe("Transaction date (YYYY-MM-DD)"),
    private_note: z.string().optional().describe("Private note"),
    line: z.array(lineSchema).optional().describe("Line items linking to invoices"),
});
const toolHandler = async ({ params }) => {
    const response = await createQuickbooksPayment(params);
    if (response.isError) {
        return { content: [{ type: "text", text: `Error creating payment: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text", text: `Payment created successfully:` },
            { type: "text", text: JSON.stringify(response.result, null, 2) },
        ],
    };
};
export const CreatePaymentTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
