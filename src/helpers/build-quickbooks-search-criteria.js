/**
 * Convert various input shapes into the criteria shape that `node-quickbooks` expects.
 *
 * If the input is already an object or array that `node-quickbooks` understands, it is returned untouched.
 * If the input is an {@link AdvancedQuickbooksSearchOptions} instance, it is converted to an array of
 * `{field, value, operator}` objects.
 */
export function buildQuickbooksSearchCriteria(input) {
    // If the user supplied an array we assume they know what they're doing.
    if (Array.isArray(input)) {
        return input;
    }
    // If the input is a plain object that does NOT look like advanced options, forward as-is
    const possibleAdvancedKeys = [
        "filters",
        "criteria",
        "asc",
        "desc",
        "limit",
        "offset",
        "count",
        "fetchAll",
    ];
    const inputKeys = Object.keys(input || {});
    const isAdvanced = inputKeys.some((k) => possibleAdvancedKeys.includes(k));
    if (!isAdvanced) {
        // simple criteria object – pass through
        return input;
    }
    // At this point we treat the input as AdvancedQuickbooksSearchOptions
    const options = input;
    const criteriaArr = [];
    // Convert filters (accept both "filters" and "criteria" as the key)
    const filterList = options.filters ?? options.criteria;
    filterList?.forEach((f) => {
        criteriaArr.push({ field: f.field, value: f.value, operator: f.operator });
    });
    // Sorting
    if (options.asc) {
        criteriaArr.push({ field: "asc", value: options.asc });
    }
    if (options.desc) {
        criteriaArr.push({ field: "desc", value: options.desc });
    }
    // Pagination / meta
    if (typeof options.limit === "number") {
        criteriaArr.push({ field: "limit", value: options.limit });
    }
    if (typeof options.offset === "number") {
        criteriaArr.push({ field: "offset", value: options.offset });
    }
    if (options.count) {
        criteriaArr.push({ field: "count", value: true });
    }
    if (options.fetchAll) {
        criteriaArr.push({ field: "fetchAll", value: true });
    }
    // If nothing ended up in the array, return empty object so Quickbooks returns all items.
    return criteriaArr.length > 0 ? criteriaArr : {};
}
