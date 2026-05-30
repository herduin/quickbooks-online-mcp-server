import { createQuickbooksVendorCredit } from "../handlers/create-quickbooks-vendor-credit.handler.js";
import { z } from "zod";
const toolName = "create_vendor_credit";
const toolDescription = "Create a vendor credit in QuickBooks Online.";
const lineItemSchema = z.object({
    amount: z.number().positive(),
    description: z.string().optional(),
    account_ref: z.string().optional(),
});
const toolSchema = z.object({
    vendor_ref: z.string().min(1).describe("Vendor ID"),
    line_items: z.array(lineItemSchema).min(1).describe("Line items"),
    txn_date: z.string().optional().describe("Transaction date (YYYY-MM-DD)"),
    doc_number: z.string().optional().describe("Document number"),
    private_note: z.string().optional().describe("Private note"),
});
const toolHandler = async ({ params }) => {
    const response = await createQuickbooksVendorCredit(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Vendor credit created:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const CreateVendorCreditTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
