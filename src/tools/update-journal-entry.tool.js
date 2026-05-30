import { updateQuickbooksJournalEntry } from "../handlers/update-quickbooks-journal-entry.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "update_journal_entry";
const toolDescription = "Update a journal entry in QuickBooks Online.";
// Define the expected input schema for updating a journal entry
const toolSchema = z.object({
    journalEntry: z.any(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await updateQuickbooksJournalEntry(args.params.journalEntry);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error updating journal entry: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Journal entry updated:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const UpdateJournalEntryTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
