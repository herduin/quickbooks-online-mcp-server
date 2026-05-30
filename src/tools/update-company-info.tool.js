import { updateQuickbooksCompanyInfo } from "../handlers/update-quickbooks-company-info.handler.js";
import { z } from "zod";
const toolName = "update_company_info";
const toolDescription = "Update the company information in QuickBooks Online.";
const toolSchema = z.object({
    id: z.string().min(1).describe("Company ID"),
    sync_token: z.string().min(1).describe("Sync token for concurrency"),
    company_name: z.string().optional().describe("Company name"),
    legal_name: z.string().optional().describe("Legal business name"),
    company_addr: z.object({
        line1: z.string().optional().describe("Address line 1"),
        city: z.string().optional().describe("City"),
        country_sub_division_code: z.string().optional().describe("State/Province code"),
        postal_code: z.string().optional().describe("Postal/ZIP code"),
        country: z.string().optional().describe("Country"),
    }).optional().describe("Company address"),
    primary_phone: z.string().optional().describe("Primary phone number"),
    email: z.string().optional().describe("Email address"),
    web_addr: z.string().optional().describe("Website URL"),
});
const toolHandler = async ({ params }) => {
    const response = await updateQuickbooksCompanyInfo(params);
    if (response.isError)
        return { content: [{ type: "text", text: `Error: ${response.error}` }] };
    return { content: [{ type: "text", text: `Company info updated:` }, { type: "text", text: JSON.stringify(response.result, null, 2) }] };
};
export const UpdateCompanyInfoTool = { name: toolName, description: toolDescription, schema: toolSchema, handler: toolHandler };
