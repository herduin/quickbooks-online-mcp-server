import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { QuickBooksToolRegistry } from "./tool-registry.js";

/**
 * Creates a new MCP Server instance for each session
 * This ensures isolation between concurrent sessions
 */
export function createMCPServer(): Server {
  const server = new Server(
    {
      name: "QuickBooks Online MCP Server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
      instructions: `This is a QuickBooks Online MCP Server.

Available operations:
- Create, read, update, delete, and search operations for 29 entity types
- 11 financial reports including Balance Sheet, P&L, Cash Flow, and more

To get started, you can:
1. Use qbo_list_tools to see all available tools
2. Use search operations to find existing entities
3. Use get operations to retrieve specific entity details
4. Use create/update operations to modify data

All tools follow a consistent naming pattern:
- create_<entity> - Create new entities
- get_<entity> - Get entity by ID
- update_<entity> - Update existing entities
- delete_<entity> - Delete entities
- search_<entities> - Search/list entities

Reports use the pattern: get_<report_name>
`,
    }
  );

  // Get all tool definitions from the registry
  const toolRegistry = QuickBooksToolRegistry.getAllTools();

  // Register tools/list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: Array.from(toolRegistry.values()).map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        ...(tool.outputSchema ? { outputSchema: tool.outputSchema } : {}),
        ...(tool.annotations ? { annotations: tool.annotations } : {}),
      })),
    };
  });

  // Register tools/call handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const tool = toolRegistry.get(toolName);

    if (!tool) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    try {
      // Validate and execute the tool
      const args = request.params.arguments || {};
      const result = await tool.handler(args);

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        // CRITICAL: Always return structuredContent when outputSchema is defined
        ...(tool.outputSchema ? { structuredContent: result } : {}),
      };
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                success: false,
                error: errorMessage,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}
