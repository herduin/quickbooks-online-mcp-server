import { searchQuickbooksJournalEntries } from "../handlers/search-quickbooks-journal-entries.handler.js";
import { ToolDefinition } from "../types/tool-definition.js";
import { z } from "zod";

// Define the tool metadata
const toolName = "search_journal_entries";
const toolDescription = "Search journal entries in QuickBooks Online that match given criteria.";

// Define the expected input schema for searching journal entries
const toolSchema = z.object({
  criteria: z.array(z.object({
    field: z.string().describe("JournalEntry field to filter on (e.g. TxnDate, DocNumber, TotalAmt, MetaData.CreateTime, MetaData.LastUpdatedTime)"),
    value: z.union([z.string(), z.number(), z.boolean()]).describe("Value to match"),
    operator: z.enum(["=", "<", ">", "<=", ">=", "LIKE", "IN"]).optional().describe("Comparison operator, defaults to ="),
  })).optional().describe("Array of filter conditions. Omit to fetch all journal entries."),
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
  const response = await searchQuickbooksJournalEntries(args.params);

  if (response.isError) {
    return {
      content: [
        { type: "text" as const, text: `Error searching journal entries: ${response.error}` },
      ],
    };
  }

  return {
    content: [
      { type: "text" as const, text: `Journal entries found:` },
      { type: "text" as const, text: JSON.stringify(response.result) },
    ],
  };
};

export const SearchJournalEntriesTool: ToolDefinition<typeof toolSchema> = {
  name: toolName,
  description: toolDescription,
  schema: toolSchema,
  handler: toolHandler,
}; 