import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
export class QuickbooksMCPServer {
    constructor() { }
    static GetServer() {
        if (QuickbooksMCPServer.instance === null) {
            QuickbooksMCPServer.instance = new McpServer({
                name: "QuickBooks Online MCP Server",
                version: "1.0.0",
            }, {
                capabilities: {
                    tools: {},
                },
            });
        }
        return QuickbooksMCPServer.instance;
    }
}
QuickbooksMCPServer.instance = null;
