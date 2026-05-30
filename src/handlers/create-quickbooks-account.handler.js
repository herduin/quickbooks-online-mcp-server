import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
// Helper to normalize field values to the correct data type expected by Quickbooks
const accountFieldTypeMap = {
    Name: "string",
    AccountType: "string",
    AccountSubType: "string",
    Description: "string",
    Classification: "string",
    Active: "boolean",
    SubAccount: "boolean",
    ParentRef: "string",
    CurrentBalance: "number",
};
function normalizeAccountPayload(payload) {
    const normalized = {};
    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null)
            return; // skip undefined
        const expectedType = accountFieldTypeMap[key];
        if (!expectedType) {
            // passthrough unknown keys without modification
            normalized[key] = value;
            return;
        }
        switch (expectedType) {
            case "string":
                normalized[key] = String(value);
                break;
            case "boolean":
                normalized[key] = typeof value === "boolean" ? value : value === "true";
                break;
            case "number":
                normalized[key] = typeof value === "number" ? value : Number(value);
                break;
            default:
                normalized[key] = value;
        }
    });
    return normalized;
}
export async function createQuickbooksAccount(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        // Build initial payload then normalize.
        const basePayload = {
            Name: data.name,
            AccountType: data.type,
            AccountSubType: data.sub_type,
            Description: data.description,
        };
        const payload = normalizeAccountPayload(basePayload);
        return new Promise((resolve) => {
            quickbooks.createAccount(payload, (err, account) => {
                if (err) {
                    resolve({ result: null, isError: true, error: formatError(err) });
                }
                else {
                    resolve({ result: account, isError: false, error: null });
                }
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
