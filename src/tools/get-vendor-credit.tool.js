import { getQuickbooksVendorCredit } from "../handlers/get-quickbooks-vendor-credit.handler.js";
import { z } from "zod";
const toolName = "get_vendor_credit";
const toolDescription = "Get a vendor credit by ID from QuickBooks Online.";
const toolSchema = z.object({ id: z.string().min(1).describe("Vendor Credit ID") });
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksVendorCredit(params.id);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Vendor credit found:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetVendorCreditTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
