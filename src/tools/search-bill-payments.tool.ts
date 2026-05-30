import { searchQuickbooksBillPayments } from "../handlers/search-quickbooks-bill-payments.handler.js";
import { ToolDefinition } from "../types/tool-definition.js";
import { z } from "zod";

// Define the tool metadata
const toolName = "search_bill_payments";
const toolDescription = "Search bill payments in QuickBooks Online that match given criteria.";

// Define the expected input schema for searching bill payments
const toolSchema = z.object({
  criteria: z.array(z.object({
    field: z.string().describe("BillPayment field to filter on (e.g. VendorRef, TxnDate, TotalAmt, PayType, MetaData.CreateTime)"),
    value: z.union([z.string(), z.number(), z.boolean()]).describe("Value to match"),
    operator: z.enum(["=", "<", ">", "<=", ">=", "LIKE", "IN"]).optional().describe("Comparison operator, defaults to ="),
  })).optional().describe("Array of filter conditions. Omit to fetch all bill payments."),
  asc: z.string().optional().describe("Field to sort ascending"),
  desc: z.string().optional().describe("Field to sort descending"),
  limit: z.number().optional().describe("Maximum results to return"),
  offset: z.number().optional().describe("Number of results to skip"),
  count: z.boolean().optional().describe("Return only the count of matching records"),
  fetchAll: z.boolean().optional().describe("Fetch all results ignoring limit/offset"),
});

type ToolParams = z.infer<typeof toolSchema>;

// Define the tool handler
const toolHandler = async (args: any) => {
  const response = await searchQuickbooksBillPayments(args.params);

  if (response.isError) {
    return {
      content: [
        { type: "text" as const, text: `Error searching bill payments: ${response.error}` },
      ],
    };
  }

  return {
    content: [
      { type: "text" as const, text: `Bill payments found:` },
      { type: "text" as const, text: JSON.stringify(response.result) },
    ],
  };
};

export const SearchBillPaymentsTool: ToolDefinition<typeof toolSchema> = {
  name: toolName,
  description: toolDescription,
  schema: toolSchema,
  handler: toolHandler,
}; 