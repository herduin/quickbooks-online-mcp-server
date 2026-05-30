import { searchQuickbooksInvoices } from "../handlers/search-quickbooks-invoices.handler.js";
import { z } from "zod";
const toolName = "search_invoices";
const toolDescription = "Search invoices in QuickBooks Online using criteria (maps to node-quickbooks findInvoices).";
// ALLOWED FIELD LISTS (derived from Quickbooks Invoice entity docs – Filterable and Sortable columns)
const ALLOWED_FILTER_FIELDS = [
    "Id",
    "MetaData.CreateTime",
    "MetaData.LastUpdatedTime",
    "DocNumber",
    "TxnDate",
    "DueDate",
    "CustomerRef",
    "ClassRef",
    "DepartmentRef",
    "Balance",
    "TotalAmt",
];
const ALLOWED_SORT_FIELDS = [
    "Id",
    "MetaData.CreateTime",
    "MetaData.LastUpdatedTime",
    "DocNumber",
    "TxnDate",
    "Balance",
    "TotalAmt",
];
// FIELD TYPE MAP
const FIELD_TYPE_MAP = {
    "Id": "string",
    "MetaData.CreateTime": "date",
    "MetaData.LastUpdatedTime": "date",
    "DocNumber": "string",
    "TxnDate": "date",
    "DueDate": "date",
    "CustomerRef": "string",
    "ClassRef": "string",
    "DepartmentRef": "string",
    "Balance": "number",
    "TotalAmt": "number",
};
// Helper function to check if the value type matches the expected type for the field
const isValidInvoiceValueType = (field, value) => {
    const expectedType = FIELD_TYPE_MAP[field];
    return typeof value === expectedType;
};
// Zod schemas that validate the fields against the white-lists
const filterableFieldSchema = z
    .string()
    .refine((val) => ALLOWED_FILTER_FIELDS.includes(val), {
    message: `Field must be one of: ${ALLOWED_FILTER_FIELDS.join(", ")}`,
});
const sortableFieldSchema = z
    .string()
    .refine((val) => ALLOWED_SORT_FIELDS.includes(val), {
    message: `Sort field must be one of: ${ALLOWED_SORT_FIELDS.join(", ")}`,
});
// Criteria can be advanced
const operatorSchema = z.enum(["=", "IN", "<", ">", "<=", ">=", "LIKE"]).optional();
const filterSchema = z.object({
    field: filterableFieldSchema,
    value: z.any(),
    operator: operatorSchema,
}).superRefine((obj, ctx) => {
    if (!isValidInvoiceValueType(obj.field, obj.value)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Value type does not match expected type for field ${obj.field}`,
        });
    }
});
const advancedCriteriaSchema = z.object({
    filters: z.array(filterSchema).optional(),
    asc: sortableFieldSchema.optional(),
    desc: sortableFieldSchema.optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
    count: z.boolean().optional(),
    fetchAll: z.boolean().optional(),
});
// Runtime schema used internally for validation
const RUNTIME_CRITERIA_SCHEMA = z.union([
    z.record(z.any()),
    z.array(z.record(z.any())),
    advancedCriteriaSchema,
]);
// Exposed schema for MCP – describes the contract clearly for LLMs
const toolSchema = z.object({
    criteria: z.union([
        z.object({
            filters: z.array(z.object({
                field: z.enum([...ALLOWED_FILTER_FIELDS]).describe("Invoice field to filter on"),
                value: z.any().describe("Filter value (string for text/dates, number for amounts)"),
                operator: z.enum(["=", "IN", "<", ">", "<=", ">=", "LIKE"]).optional().describe("Comparison operator, defaults to ="),
            })).optional().describe("Array of filter conditions"),
            asc: z.string().optional().describe("Field to sort ascending"),
            desc: z.string().optional().describe("Field to sort descending"),
            limit: z.number().optional().describe("Max results to return"),
            offset: z.number().optional().describe("Number of results to skip"),
            fetchAll: z.boolean().optional().describe("Fetch all results (ignore limit/offset)"),
        }).describe("Advanced criteria with filters array and sorting/pagination options"),
        z.record(z.any()).describe("Simple key-value pairs, e.g. {\"CustomerRef\": \"123\", \"Balance\": 0}"),
    ]).optional().describe("Search criteria. Omit to fetch all invoices."),
});
const toolHandler = async ({ params }) => {
    const { criteria = {} } = params;
    // Validate runtime schema
    const parsed = RUNTIME_CRITERIA_SCHEMA.safeParse(criteria);
    if (!parsed.success) {
        return {
            content: [
                { type: "text", text: `Invalid criteria: ${parsed.error.message}` },
            ],
        };
    }
    const response = await searchQuickbooksInvoices(criteria);
    if (response.isError) {
        return {
            content: [
                { type: "text", text: `Error searching invoices: ${response.error}` },
            ],
        };
    }
    const invoices = response.result;
    return {
        content: [
            { type: "text", text: `Found ${invoices?.length || 0} invoices` },
            ...(invoices?.map((inv) => ({ type: "text", text: JSON.stringify(inv) })) || []),
        ],
    };
};
export const SearchInvoicesTool = {
    name: toolName,
    description: toolDescription,
    schema: toolSchema,
    handler: toolHandler,
};
