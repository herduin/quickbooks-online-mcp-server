export function RegisterTool(server, toolDefinition) {
    server.tool(toolDefinition.name, toolDefinition.description, { params: toolDefinition.schema }, toolDefinition.handler);
}
