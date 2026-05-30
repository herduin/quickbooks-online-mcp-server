#!/usr/bin/env node

import "dotenv/config";
import { startServer } from "./http-server.js";

async function main() {
  try {
    console.log("Starting QuickBooks MCP HTTP Server...");
    console.log();

    // Check required QuickBooks environment variables
    const requiredEnvVars = [
      "QUICKBOOKS_CLIENT_ID",
      "QUICKBOOKS_CLIENT_SECRET",
      "QUICKBOOKS_REFRESH_TOKEN",
      "QUICKBOOKS_REALM_ID",
    ];

    const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
    if (missingVars.length > 0) {
      console.warn("WARNING: Missing QuickBooks environment variables:");
      missingVars.forEach((v) => console.warn(`  - ${v}`));
      console.warn("The server will start but API calls will fail.");
      console.warn();
    }

    await startServer();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
