import { getQuickbooksTaxCode } from "../handlers/get-quickbooks-tax-code.handler.js";
import { z } from "zod";
const toolName = "get_tax_code";
const toolDescription = "Retrieve a specific tax code from QuickBooks Online by ID.";
const toolSchema = z.object({
    id: z.string().min(1).describe("Tax code ID"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksTaxCode(params.id);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetTaxCodeTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
