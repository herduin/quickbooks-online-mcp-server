import { searchQuickbooksItems } from "../handlers/search-quickbooks-items.handler.js";
import { ToolDefinition } from "../types/tool-definition.js";
import { z } from "zod";

const toolName = "search_items";
const toolDescription = "Search items in QuickBooks Online using criteria (maps to node-quickbooks findItems).";

// Allowed field lists derived from QuickBooks Online Item entity documentation (Filterable/Sortable columns)
const ALLOWED_FILTER_FIELDS = [
  "Id",
  "MetaData.CreateTime",
  "MetaData.LastUpdatedTime",
  "Name",
  "Active",
  "Type",
  "Sku",
] as const;

const ALLOWED_SORT_FIELDS = [
  "Id",
  "MetaData.CreateTime",
  "MetaData.LastUpdatedTime",
  "Name",
  "ParentRef",
  "PrefVendorRef",
  "UnitPrice",
  "Type",
  "QtyOnHand",
] as const;

const ITEM_FIELD_TYPE_MAP = {
  "Id": "string",
  "MetaData.CreateTime": "date",
  "MetaData.LastUpdatedTime": "date",
  "Name": "string",
  "Active": "boolean",
  "Type": "string",
  "Sku": "string",
  "ParentRef": "string",
  "PrefVendorRef": "string",
  "UnitPrice": "number",
  "QtyOnHand": "number",
};

const filterableFieldSchema = z
  .string()
  .refine((val) => (ALLOWED_FILTER_FIELDS as readonly string[]).includes(val), {
    message: `Field must be one of: ${ALLOWED_FILTER_FIELDS.join(", ")}`,
  });

const sortableFieldSchema = z
  .string()
  .refine((val) => (ALLOWED_SORT_FIELDS as readonly string[]).includes(val), {
    message: `Sort field must be one of: ${ALLOWED_SORT_FIELDS.join(", ")}`,
  });

// Advanced criteria validations
const operatorSchema = z.enum(["=", "IN", "<", ">", "<=", ">=", "LIKE"]).optional();
const filterSchema = z.object({
  field: filterableFieldSchema,
  value: z.any(),
  operator: operatorSchema,
}).superRefine((obj, ctx) => {
  if (!isValidItemValueType(obj.field as string, obj.value)) {
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
        field: z.enum([...ALLOWED_FILTER_FIELDS]).describe("Item field to filter on"),
        value: z.any().describe("Filter value (string for text/dates, number for amounts, boolean for Active)"),
        operator: z.enum(["=", "IN", "<", ">", "<=", ">=", "LIKE"]).optional().describe("Comparison operator, defaults to ="),
      })).optional().describe("Array of filter conditions"),
      asc: z.string().optional().describe("Field to sort ascending"),
      desc: z.string().optional().describe("Field to sort descending"),
      limit: z.number().optional().describe("Max results to return"),
      offset: z.number().optional().describe("Number of results to skip"),
      fetchAll: z.boolean().optional().describe("Fetch all results (ignore limit/offset)"),
    }).describe("Advanced criteria with filters array and sorting/pagination options"),
    z.record(z.any()).describe("Simple key-value pairs, e.g. {\"Name\": \"Widget\", \"Type\": \"Inventory\"}"),
  ]).optional().describe("Search criteria. Omit to fetch all items."),
});

const toolHandler = async ({ params }: any) => {
  const { criteria = {} } = params;

  // Validate against runtime schema
  const parsed = RUNTIME_CRITERIA_SCHEMA.safeParse(criteria);
  if (!parsed.success) {
    return {
      content: [
        { type: "text" as const, text: `Invalid criteria: ${parsed.error.message}` },
      ],
    };
  }

  const response = await searchQuickbooksItems(criteria);

  if (response.isError) {
    return { content: [{ type: "text" as const, text: `Error searching items: ${response.error}` }] };
  }
  const items = response.result;
  return {
    content: [
      { type: "text" as const, text: `Found ${items?.length || 0} items` },
      ...(items?.map((item) => ({ type: "text" as const, text: JSON.stringify(item) })) || []),
    ],
  };
};

function isValidItemValueType(field: string, value: any): boolean {
  const expected = ITEM_FIELD_TYPE_MAP[field as keyof typeof ITEM_FIELD_TYPE_MAP];
  if (!expected) return true;
  const check = (v: any): boolean => {
    switch (expected) {
      case "string":
        return typeof v === "string";
      case "number":
        return typeof v === "number";
      case "boolean":
        return typeof v === "boolean";
      case "date":
        return typeof v === "string";
      default:
        return true;
    }
  };
  return Array.isArray(value) ? value.every(check) : check(value);
}

export const SearchItemsTool: ToolDefinition<typeof toolSchema> = {
  name: toolName,
  description: toolDescription,
  schema: toolSchema,
  handler: toolHandler,
}; 