import { searchQuickbooksTaxRates } from "../handlers/search-quickbooks-tax-rates.handler.js";
import { z } from "zod";
const toolName = "search_tax_rates";
const toolDescription = "Search for tax rates in QuickBooks Online with optional filters.";
const toolSchema = z.object({
    name: z.string().optional().describe("Filter by tax rate name"),
    active: z.boolean().optional().describe("Filter by active status"),
    limit: z.number().optional().describe("Maximum results to return"),
});
const toolHandler = async ({ params }) => {
    const response = await searchQuickbooksTaxRates(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Found ${response.result.length} tax rates:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const SearchTaxRatesTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
