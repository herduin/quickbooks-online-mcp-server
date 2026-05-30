import { deleteQuickbooksJournalEntry } from "../handlers/delete-quickbooks-journal-entry.handler.js";
import { z } from "zod";
// Define the tool metadata
const toolName = "delete_journal_entry";
const toolDescription = "Delete (make inactive) a journal entry in QuickBooks Online.";
// Define the expected input schema for deleting a journal entry
const toolSchema = z.object({
    idOrEntity: z.any(),
});
// Define the tool handler
const toolHandler = async (args) => {
    const response = await deleteQuickbooksJournalEntry(args.params.idOrEntity);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error deleting journal entry: ${response.error}` },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: `Journal entry deleted:` },
            { type: "text", text: JSON.stringify(response.result) },
        ],
    };
};
export const DeleteJournalEntryTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
