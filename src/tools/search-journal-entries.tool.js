import { searchQuickbooksJournalEntries } from "../handlers/search-quickbooks-journal-entries.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "search_journal_entries";
const toolDescription = "Search journal entries in QuickBooks Online that match given criteria.";
// Define the expected input schema for searching journal entries
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
    const response = await searchQuickbooksJournalEntries(args.params);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error searching journal entries: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Journal entries found:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const SearchJournalEntriesTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
