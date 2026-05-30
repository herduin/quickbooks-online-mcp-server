import { getQuickbooksCompanyInfo } from "../handlers/get-quickbooks-company-info.handler.js";
import { z } from "zod";
const toolName = "get_company_info";
const toolDescription = "Retrieve the company information from QuickBooks Online.";
const toolSchema = z.object({
    company_id: z.string().optional().describe("Company ID (uses connected company if not specified)"),
});
const toolHandler = async ({ params }) => {
    const response = await getQuickbooksCompanyInfo(params.company_id);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const GetCompanyInfoTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
