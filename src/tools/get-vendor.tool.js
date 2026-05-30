import { getQuickbooksVendor } from "../handlers/get-quickbooks-vendor.handler.js";
import { z } from "zod";
const toolName = "get-vendor";
const toolDescription = "Get a vendor by ID from QuickBooks Online.";
const toolSchema = z.object({
    id: z.string(),
});
const toolHandler = async (args) => {
    const response = await getQuickbooksVendor(args.params.id);
    if (response.isError) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error getting vendor: ${response.error}`,
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
export const GetVendorTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
