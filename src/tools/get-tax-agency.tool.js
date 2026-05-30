import { getQuickbooksTaxAgency } from "../handlers/get-quickbooks-tax-agency.handler.js";
import { z } from "zod";
const toolName = "get_tax_agency";
const toolDescription = "Retrieve a specific tax agency from QuickBooks Online by ID.";
const toolSchema = z.object({
    id: z.string().min(1).describe("Tax agency ID"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksTaxAgency(params.id);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetTaxAgencyTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
