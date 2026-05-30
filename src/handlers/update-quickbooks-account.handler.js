import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
// Reuse the same field-type map for normalization
const updateFieldTypeMap = {
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
function normalizePatch(patch) {
    const normalized = {};
    Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined)
            return;
        const expectedType = updateFieldTypeMap[key];
        if (!expectedType) {
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
export async function updateQuickbooksAccount({ account_id, patch }) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const existing = await new Promise((res, rej) => {
            quickbooks.getAccount(account_id, (e, acc) => (e ? rej(e) : res(acc)));
        });
        // When merging existing with patch, normalize the patch first.
        const normalizedPatch = normalizePatch(patch);
        const payload = { ...existing, ...normalizedPatch, Id: account_id, sparse: true };
        return new Promise((resolve) => {
            quickbooks.updateAccount(payload, (err, account) => {
                if (err)
                    resolve({ result: null, isError: true, error: formatError(err) });
                else
                    resolve({ result: account, isError: false, error: null });
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
