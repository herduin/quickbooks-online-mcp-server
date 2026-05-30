import express, { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { createMCPServer } from "./mcp-server.js";
import { QuickBooksToolRegistry } from "./tool-registry.js";

const PORT = parseInt(process.env.PORT || "3230", 10);
const AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;

// Session storage
const streamableTransports = new Map<string, StreamableHTTPServerTransport>();
const sseTransports = new Map<string, SSEServerTransport>();

/**
 * Bearer token authentication middleware
 */
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // If no token configured, allow all requests (passthrough)
  if (!AUTH_TOKEN) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(401).json({
      jsonrpc: "2.0",
      error: {
        code: -32001,
        message: "Unauthorized",
      },
      id: null,
    });
  }

  next();
}

/**
 * Create and configure Express app
 */
export function createExpressApp() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health endpoint (no auth required)
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Ready endpoint (checks QuickBooks configuration)
  app.get("/ready", (_req, res) => {
    const hasQBConfig =
      process.env.QUICKBOOKS_CLIENT_ID &&
      process.env.QUICKBOOKS_CLIENT_SECRET &&
      process.env.QUICKBOOKS_REALM_ID &&
      process.env.QUICKBOOKS_REFRESH_TOKEN;

    if (hasQBConfig) {
      res.status(200).json({ status: "ready" });
    } else {
      res.status(503).json({
        status: "not ready",
        message: "QuickBooks configuration incomplete",
      });
    }
  });

  // Version endpoint
  app.get("/version", (_req, res) => {
    const tools = QuickBooksToolRegistry.getAllTools();
    res.json({
      name: "QuickBooks Online MCP HTTP Server",
      version: "1.0.0",
      transports: ["streamable-http", "sse"],
      toolCount: tools.size,
    });
  });

  // ========== Streamable HTTP Transport ==========
  // POST /mcp - Initialize or handle requests
  app.post("/mcp", authMiddleware, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport = sessionId ? streamableTransports.get(sessionId) : undefined;

    // Initialize new session if this is an initialize request
    if (!transport && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sid) => {
          if (transport) {
            streamableTransports.set(sid, transport);
          }
        },
        // DNS rebinding protection disabled for proxy/tunnel compatibility
        // enableDnsRebindingProtection: false, // default is false
      });

      transport.onclose = () => {
        if (transport?.sessionId) {
          streamableTransports.delete(transport.sessionId);
        }
      };

      // Create a new MCP server instance for this session
      const server = createMCPServer();
      await server.connect(transport);
    }

    if (!transport) {
      return res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "No valid session. Send an initialize request first.",
        },
        id: null,
      });
    }

    await transport.handleRequest(req, res, req.body);
  });

  // GET /mcp - Server-to-client stream
  app.get("/mcp", authMiddleware, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string;
    const transport = streamableTransports.get(sessionId);

    if (!transport) {
      return res.status(400).send("Invalid or missing session ID");
    }

    await transport.handleRequest(req, res);
  });

  // DELETE /mcp - Close session
  app.delete("/mcp", authMiddleware, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string;
    const transport = streamableTransports.get(sessionId);

    if (!transport) {
      return res.status(400).send("Invalid or missing session ID");
    }

    await transport.handleRequest(req, res);
  });

  // ========== SSE Legacy Transport ==========
  // GET /sse - Initialize SSE connection
  app.get("/sse", authMiddleware, async (_req, res) => {
    const transport = new SSEServerTransport("/messages", res);
    sseTransports.set(transport.sessionId, transport);

    res.on("close", () => {
      sseTransports.delete(transport.sessionId);
    });

    // Create a new MCP server instance for this session
    const server = createMCPServer();
    await server.connect(transport);
  });

  // POST /messages - Handle SSE messages
  app.post("/messages", authMiddleware, async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = sseTransports.get(sessionId);

    if (!transport) {
      return res.status(400).send("No transport for sessionId");
    }

    await transport.handlePostMessage(req, res, req.body);
  });

  return app;
}

/**
 * Start the HTTP server
 */
export async function startServer() {
  const app = createExpressApp();

  const server = app.listen(PORT, () => {
    console.log(`QuickBooks MCP HTTP Server running on port ${PORT}`);
    console.log(`Endpoints:`);
    console.log(`  Health:     GET  ${PORT}/health`);
    console.log(`  Ready:      GET  ${PORT}/ready`);
    console.log(`  Version:    GET  ${PORT}/version`);
    console.log(`  MCP (HTTP): POST/GET/DELETE ${PORT}/mcp`);
    console.log(`  MCP (SSE):  GET  ${PORT}/sse, POST ${PORT}/messages`);
    console.log();
    if (AUTH_TOKEN) {
      console.log(`Authentication: Bearer token required`);
    } else {
      console.log(`Authentication: DISABLED (no MCP_AUTH_TOKEN set)`);
    }
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, closing server...");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received, closing server...");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });

  return server;
}
