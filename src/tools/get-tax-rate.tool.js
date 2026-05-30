import { getQuickbooksTaxRate } from "../handlers/get-quickbooks-tax-rate.handler.js";
import { z } from "zod";
const toolName = "get_tax_rate";
const toolDescription = "Retrieve a specific tax rate from QuickBooks Online by ID.";
const toolSchema = z.object({
    id: z.string().min(1).describe("Tax rate ID"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksTaxRate(params.id);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetTaxRateTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
