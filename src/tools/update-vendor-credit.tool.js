import { updateQuickbooksVendorCredit } from "../handlers/update-quickbooks-vendor-credit.handler.js";
import { z } from "zod";
const toolName = "update_vendor_credit";
const toolDescription = "Update a vendor credit in QuickBooks Online.";
const toolSchema = z.object({
    id: z.string().min(1).describe("Vendor Credit ID"),
    sync_token: z.string().min(1).describe("Sync token"),
    vendor_ref: z.string().optional().describe("Vendor ID"),
    private_note: z.string().optional().describe("Private note"),
});
const toolHandler = async ({ params }) => {
    const response = await updateQuickbooksVendorCredit(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Vendor credit updated:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const UpdateVendorCreditTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
