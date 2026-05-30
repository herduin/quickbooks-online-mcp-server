import express, { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { createMCPServer } from "./mcp-server.js";
import { QuickBooksToolRegistry } from "./tool-registry.js";
import OAuthClient from "intuit-oauth";
import { quickbooksClient } from "../../src/clients/quickbooks-client.js";

const PORT = parseInt(process.env.PORT || "3230", 10);
const AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;

// OAuth client instance (lazy-initialized)
let oauthClient: OAuthClient | null = null;

function getOAuthClient(): OAuthClient {
  if (!oauthClient) {
    const clientId = process.env.QUICKBOOKS_CLIENT_ID;
    const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET;
    const environment = process.env.QUICKBOOKS_ENVIRONMENT || "sandbox";
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI || `http://localhost:${PORT}/auth/callback`;

    if (!clientId || !clientSecret) {
      throw new Error("QUICKBOOKS_CLIENT_ID and QUICKBOOKS_CLIENT_SECRET are required for OAuth");
    }

    oauthClient = new OAuthClient({
      clientId,
      clientSecret,
      environment,
      redirectUri,
    });
  }
  return oauthClient;
}

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

  // ========== OAuth Authentication Flow ==========

  // GET /auth - Start OAuth flow (redirects to Intuit)
  app.get("/auth", authMiddleware, (_req, res) => {
    try {
      const client = getOAuthClient();
      const authUri = client.authorizeUri({
        scope: [OAuthClient.scopes.Accounting as string],
        state: randomUUID(),
      });
      res.redirect(authUri.toString());
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to start OAuth flow",
        message: error?.message || String(error),
      });
    }
  });

  // GET /auth/callback - OAuth callback from Intuit (no bearer auth - Intuit redirects here)
  app.get("/auth/callback", async (req, res) => {
    try {
      const client = getOAuthClient();
      const authResponse = await client.createToken(req.url);
      const token = authResponse.token as any;

      const refreshToken = token.refresh_token;
      const realmId = token.realmId || req.query.realmId;

      if (!refreshToken || !realmId) {
        return res.status(400).json({
          error: "Incomplete token response",
          message: "Missing refresh_token or realmId from Intuit response",
        });
      }

      // Inject tokens into the running QuickBooks client singleton
      quickbooksClient.setTokens(refreshToken, realmId as string);

      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>QuickBooks OAuth Success</title></head>
          <body style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 2rem;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #f0fdf4;
          ">
            <h2 style="color: #16a34a;">&#10003; Successfully connected to QuickBooks!</h2>
            <p style="color: #6b7280; font-size: 0.875rem;">The server is now ready. Copy the values below into your stack environment for persistence.</p>
            <div style="background: #1f2937; color: #f9fafb; padding: 1.5rem; border-radius: 8px; max-width: 700px; width: 100%; margin-top: 1rem; word-break: break-all; font-family: monospace; font-size: 0.8rem; line-height: 1.8;">
              <div><span style="color: #9ca3af;"># Add these to your Docker/stack environment variables:</span></div>
              <div>QUICKBOOKS_REALM_ID=<span id="realm">${realmId}</span></div>
              <div>QUICKBOOKS_REFRESH_TOKEN=<span id="token">${refreshToken}</span></div>
            </div>
            <button onclick="navigator.clipboard.writeText('QUICKBOOKS_REALM_ID=${realmId}\nQUICKBOOKS_REFRESH_TOKEN=${refreshToken}')" style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: #16a34a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">Copy to Clipboard</button>
            <p style="color: #dc2626; font-size: 0.75rem; margin-top: 2rem; max-width: 500px; text-align: center;">
              <strong>Warning:</strong> These tokens are in memory only. If the container restarts without these env vars, you will need to re-authenticate.
            </p>
          </body>
        </html>
      `);

      console.log(`[oauth] ====== AUTHENTICATION SUCCESSFUL ======`);
      console.log(`[oauth] QUICKBOOKS_REALM_ID=${realmId}`);
      console.log(`[oauth] QUICKBOOKS_REFRESH_TOKEN=${refreshToken}`);
      console.log(`[oauth] =========================================`);
      console.log(`[oauth] Save the above values in your Docker environment for persistence.`);
    } catch (error: any) {
      console.error("[oauth] Callback error:", error);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <body style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #fef2f2;
          ">
            <h2 style="color: #dc2626;">&#10007; OAuth Error</h2>
            <p style="color: #374151;">${error?.message || String(error)}</p>
            <p style="color: #6b7280; font-size: 0.875rem;">Check server logs for details.</p>
          </body>
        </html>
      `);
    }
  });

  // GET /auth/status - Check current authentication state
  app.get("/auth/status", authMiddleware, (_req, res) => {
    const refreshToken = process.env.QUICKBOOKS_REFRESH_TOKEN || null;
    const realmId = process.env.QUICKBOOKS_REALM_ID || null;
    const hasClientId = !!process.env.QUICKBOOKS_CLIENT_ID;
    const hasClientSecret = !!process.env.QUICKBOOKS_CLIENT_SECRET;
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI || `http://localhost:${PORT}/auth/callback`;

    res.json({
      authenticated: !!refreshToken && !!realmId,
      tokens: {
        QUICKBOOKS_REALM_ID: realmId,
        QUICKBOOKS_REFRESH_TOKEN: refreshToken,
      },
      config: {
        clientId: hasClientId,
        clientSecret: hasClientSecret,
        environment: process.env.QUICKBOOKS_ENVIRONMENT || "sandbox",
        redirectUri,
      },
      instructions: !refreshToken
        ? `1. Register "${redirectUri}" as a Redirect URI in your Intuit Developer Portal app. 2. Visit /auth to start the OAuth flow.`
        : "Authenticated. Save the tokens above in your Docker environment for persistence.",
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
