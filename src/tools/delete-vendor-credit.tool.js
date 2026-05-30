import { deleteQuickbooksVendorCredit } from "../handlers/delete-quickbooks-vendor-credit.handler.js";
import { z } from "zod";
const toolName = "delete_vendor_credit";
const toolDescription = "Delete a vendor credit in QuickBooks Online.";
const toolSchema = z.object({ idOrEntity: z.any() });
const toolHandler = async (args) => {
    const response = await deleteQuickbooksVendorCredit(args.params.idOrEntity);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Vendor credit deleted:` }, { type: "text", text: JSON.stringify(response.result) }] };
};
export const DeleteVendorCreditTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
