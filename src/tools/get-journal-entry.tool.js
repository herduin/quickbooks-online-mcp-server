import { getQuickbooksJournalEntry } from "../handlers/get-quickbooks-journal-entry.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "get_journal_entry";
const toolDescription = "Get a journal entry by Id from QuickBooks Online.";
// Define the expected input schema for getting a journal entry
const toolSchema = z.object({
    id: z.string(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await getQuickbooksJournalEntry(args.params.id);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error getting journal entry: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Journal entry retrieved:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const GetJournalEntryTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
