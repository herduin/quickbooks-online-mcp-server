import { searchQuickbooksBillPayments } from "../handlers/search-quickbooks-bill-payments.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "search_bill_payments";
const toolDescription = "Search bill payments in QuickBooks Online that match given criteria.";
// Define the expected input schema for searching bill payments
const toolSchema = z.object({
    criteria: z.array(z.any()).optional(),
    asc: z.string().optional(),
    desc: z.string().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
    count: z.boolean().optional(),
    fetchAll: z.boolean().optional(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await searchQuickbooksBillPayments(args.params);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error searching bill payments: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Bill payments found:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const SearchBillPaymentsTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
