import { deleteQuickbooksVendor } from "../handlers/delete-quickbooks-vendor.handler.js";
import { z } from "zod";
const toolName = "delete-vendor";
const toolDescription = "Delete a vendor in QuickBooks Online.";
const toolSchema = z.object({
    vendor: z.object({
        Id: z.string(),
        SyncToken: z.string(),
    }),
});
const toolHandler = async (args) => {
    const response = await deleteQuickbooksVendor(args.params.vendor);
    if (response.isError) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error deleting vendor: ${response.error}`,
                },
            ],
        };
    }
    const vendor = response.result;
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(vendor),
            }
        ],
    };
};
export const DeleteVendorTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
