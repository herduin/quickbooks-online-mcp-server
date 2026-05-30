import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function createQuickbooksAttachable(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const payload = { FileName: data.file_name };
        if (data.note)
            payload.Note = data.note;
        if (data.category)
            payload.Category = data.category;
        if (data.content_type)
            payload.ContentType = data.content_type;
        if (data.attachable_ref) {
            payload.AttachableRef = [{
                    EntityRef: {
                        type: data.attachable_ref.entity_ref_type,
                        value: data.attachable_ref.entity_ref_value
                    }
                }];
        }
        return new Promise((resolve) => {
            quickbooks.createAttachable(payload, (err, created) => {
                if (err)
                    resolve({ result: null, isError: true, error: formatError(err) });
                else
                    resolve({ result: created, isError: false, error: null });
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
