# QuickBooks MCP HTTP Server (Docker)

HTTP-based MCP server for QuickBooks Online, compatible with n8n and other HTTP MCP clients.

## Features

- **Streamable HTTP Transport** - Recommended for n8n (POST/GET/DELETE `/mcp`)
- **SSE Legacy Transport** - For older clients (GET `/sse` + POST `/messages`)
- **Session Management** - Isolated sessions with `Mcp-Session-Id` header
- **Bearer Authentication** - Optional token-based authentication
- **Health Endpoints** - `/health`, `/ready`, `/version`
- **144 Tools** - Complete QuickBooks Online API coverage
- **Multi-arch Support** - `linux/amd64` and `linux/arm64`

## Quick Start

### Using Docker Compose (Recommended)

1. **Copy environment file:**
   ```bash
   cd docker
   cp .env.example .env
   ```

2. **Edit `.env` with your credentials:**
   ```env
   QUICKBOOKS_CLIENT_ID=your_client_id
   QUICKBOOKS_CLIENT_SECRET=your_client_secret
   QUICKBOOKS_REFRESH_TOKEN=your_refresh_token
   QUICKBOOKS_REALM_ID=your_realm_id
   QUICKBOOKS_ENVIRONMENT=sandbox
   MCP_AUTH_TOKEN=your_secure_token
   ```

3. **Start the server:**
   ```bash
   docker-compose up -d
   ```

4. **Verify it's running:**
   ```bash
   curl http://localhost:3230/health
   curl http://localhost:3230/version
   ```

### Using Docker Run

```bash
docker run -d \
  --name qbo-mcp-server \
  -p 3230:3230 \
  -e QUICKBOOKS_CLIENT_ID=your_client_id \
  -e QUICKBOOKS_CLIENT_SECRET=your_client_secret \
  -e QUICKBOOKS_REFRESH_TOKEN=your_refresh_token \
  -e QUICKBOOKS_REALM_ID=your_realm_id \
  -e QUICKBOOKS_ENVIRONMENT=sandbox \
  -e MCP_AUTH_TOKEN=your_token \
  ghcr.io/herduin/quickbooks-online-mcp-server-http:latest
```

### Using Pre-built Image from GitHub

Images are automatically built and published to GitHub Container Registry on every push to `main`:

```bash
docker pull ghcr.io/herduin/quickbooks-online-mcp-server-http:latest
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `QUICKBOOKS_CLIENT_ID` | Yes | - | QuickBooks OAuth client ID |
| `QUICKBOOKS_CLIENT_SECRET` | Yes | - | QuickBooks OAuth client secret |
| `QUICKBOOKS_REFRESH_TOKEN` | No* | - | QuickBooks OAuth refresh token (can be obtained via `/auth`) |
| `QUICKBOOKS_REALM_ID` | No* | - | QuickBooks company ID (can be obtained via `/auth`) |
| `QUICKBOOKS_ENVIRONMENT` | No | `sandbox` | `sandbox` or `production` |
| `QUICKBOOKS_REDIRECT_URI` | No | `http://localhost:3230/auth/callback` | OAuth callback URL (set to your public URL) |
| `MCP_AUTH_TOKEN` | No | - | Bearer token for MCP endpoint authentication (optional) |
| `PORT` | No | `3230` | HTTP server port |

\* Required for API calls. If not provided at startup, use the built-in OAuth flow (`/auth`) to obtain them.

### Getting QuickBooks Credentials (Built-in OAuth Flow)

The server includes a built-in OAuth flow — no separate auth server needed:

1. **Set up your Intuit app:**
   - Go to [Intuit Developer Portal](https://developer.intuit.com/)
   - Create an app (or use existing)
   - Add your callback URL as a Redirect URI: `https://your-domain.com/auth/callback`

2. **Configure your stack with at minimum:**
   ```env
   QUICKBOOKS_CLIENT_ID=your_client_id
   QUICKBOOKS_CLIENT_SECRET=your_client_secret
   QUICKBOOKS_REDIRECT_URI=https://your-domain.com/auth/callback
   QUICKBOOKS_ENVIRONMENT=sandbox  # or production
   ```

3. **Start the server and visit `/auth`** — you'll be redirected to Intuit to authorize.

4. **After authorization**, the callback page displays your `QUICKBOOKS_REFRESH_TOKEN` and `QUICKBOOKS_REALM_ID`. Copy them into your stack environment for persistence across restarts.

5. **Verify:** `GET /auth/status` shows current authentication state and token values.

## API Endpoints

### Health & Status

- **`GET /health`** - Liveness check (always returns 200)
- **`GET /ready`** - Readiness check (validates QuickBooks configuration)
- **`GET /version`** - Server version and tool count

### OAuth Authentication

- **`GET /auth`** - Start OAuth flow (redirects to Intuit login)
- **`GET /auth/callback`** - OAuth callback (receives tokens from Intuit)
- **`GET /auth/status`** - Check authentication state and retrieve tokens

> **Note:** `/auth` and `/auth/status` are protected by `MCP_AUTH_TOKEN` (if configured). The `/auth/callback` endpoint has no auth (Intuit redirects the browser there directly).

### MCP Protocol (Streamable HTTP)

- **`POST /mcp`** - Initialize session or send requests
- **`GET /mcp`** - Receive server-to-client stream
- **`DELETE /mcp`** - Close session

All MCP requests require the `Mcp-Session-Id` header (except initial `initialize`).

### MCP Protocol (SSE Legacy)

- **`GET /sse`** - Initialize SSE connection
- **`POST /messages?sessionId={id}`** - Send messages

## Usage with n8n

### Configure MCP Client Tool Node

1. Add **MCP Client Tool** node to your workflow
2. **Server Transport:** Select `HTTP Streamable`
3. **URL:** `http://your-server:3230/mcp`
4. **Authentication:** Select `Bearer`
   - **Token:** Your `MCP_AUTH_TOKEN` value
5. **Tools:** Select "All" or choose specific tools
6. Connect to an **AI Agent** node

### Example: List Invoices

```json
{
  "tool": "search_invoices",
  "arguments": {
    "query": "SELECT * FROM Invoice MAXRESULTS 10"
  }
}
```

## Testing with curl

### OAuth Flow

```bash
# Check auth status
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3230/auth/status

# Start OAuth (open in browser - will redirect to Intuit)
open "http://localhost:3230/auth"

# After callback completes, verify:
curl http://localhost:3230/ready
# Should return: {"status":"ready"}
```

### 1. Initialize Session

```bash
U=http://localhost:3230/mcp
H=(-H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" -H "Authorization: Bearer YOUR_TOKEN")

# Initialize and capture session ID
SID=$(curl -s -D - -o /dev/null -X POST $U "${H[@]}" -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {"name": "curl", "version": "1"}
  }
}' | grep -i mcp-session-id | awk '{print $2}' | tr -d '\r')

echo "Session ID: $SID"
```

### 2. Send Initialized Notification

```bash
curl -s -X POST $U "${H[@]}" -H "Mcp-Session-Id: $SID" -d '{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}'
```

### 3. List Tools

```bash
curl -s -X POST $U "${H[@]}" -H "Mcp-Session-Id: $SID" -d '{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}' | jq '.result.tools[] | {name, description}'
```

### 4. Call a Tool

```bash
curl -s -X POST $U "${H[@]}" -H "Mcp-Session-Id: $SID" -d '{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "qbo_list_tools",
    "arguments": {}
  }
}' | jq '.'
```

## Building Locally

### Build the Image

```bash
# From repository root
docker build -f docker/Dockerfile -t qbo-mcp-server:local .
```

### Run Local Build

```bash
docker run -d \
  --name qbo-mcp-local \
  -p 3230:3230 \
  --env-file docker/.env \
  qbo-mcp-server:local
```

## Deployment

### Docker Compose (Production)

```yaml
version: '3.8'
services:
  qbo-mcp:
    image: ghcr.io/herduin/quickbooks-online-mcp-server-http:latest
    container_name: qbo-mcp-server
    restart: unless-stopped
    ports:
      - "3230:3230"
    environment:
      QUICKBOOKS_CLIENT_ID: ${QUICKBOOKS_CLIENT_ID}
      QUICKBOOKS_CLIENT_SECRET: ${QUICKBOOKS_CLIENT_SECRET}
      QUICKBOOKS_REFRESH_TOKEN: ${QUICKBOOKS_REFRESH_TOKEN}
      QUICKBOOKS_REALM_ID: ${QUICKBOOKS_REALM_ID}
      QUICKBOOKS_ENVIRONMENT: production
      MCP_AUTH_TOKEN: ${MCP_AUTH_TOKEN}
      NODE_ENV: production
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3230/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 5s
      retries: 3
```

### Behind a Reverse Proxy (Nginx)

```nginx
server {
    listen 443 ssl http2;
    server_name qbo-mcp.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3230;
        proxy_http_version 1.1;

        # Required for SSE
        proxy_buffering off;
        proxy_cache off;

        # Required for Streamable HTTP
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts for long-lived connections
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
```

### Cloudflare Tunnel

Cloudflare tunnels work without additional configuration. The server has DNS rebinding protection **disabled** by default to support proxies that rewrite the `Host` header.

```bash
cloudflared tunnel --url http://localhost:3230
```

### Portainer

When using Portainer webhooks with `:latest` tag:

1. Enable **"Re-pull image"** in Stack settings → Automatic updates
2. Or use Portainer API with `pullImage: true`:

```bash
curl -X PUT "$PORTAINER_URL/api/stacks/$STACK_ID?endpointId=$ENDPOINT_ID" \
  -H "X-API-Key: $PORTAINER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "stackFileContent": "...",
    "env": [...],
    "prune": false,
    "pullImage": true
  }'
```

## Monitoring

### Check Logs

```bash
docker logs qbo-mcp-server
docker logs -f qbo-mcp-server  # Follow
```

### Health Checks

```bash
# Liveness
curl http://localhost:3230/health

# Readiness (checks QB config)
curl http://localhost:3230/ready

# Version info
curl http://localhost:3230/version
```

### Metrics (via Docker)

```bash
docker stats qbo-mcp-server
```

## Troubleshooting

### Server won't start

1. **Check logs:**
   ```bash
   docker logs qbo-mcp-server
   ```

2. **Verify environment variables:**
   ```bash
   docker exec qbo-mcp-server env | grep QUICKBOOKS
   ```

3. **Test readiness:**
   ```bash
   curl http://localhost:3230/ready
   ```

### n8n connection fails

1. **Verify URL:** Use `http://host:3230/mcp` (not `https` unless behind SSL proxy)
2. **Check auth token:** Must match `MCP_AUTH_TOKEN` environment variable
3. **Test with curl:** Follow the "Testing with curl" section above
4. **Check n8n logs:** Look for specific error messages

### Tools fail with errors

1. **Verify QB credentials:** Run readiness check
2. **Check refresh token:** May need to regenerate (tokens expire)
3. **Sandbox vs Production:** Ensure `QUICKBOOKS_ENVIRONMENT` matches your app
4. **API permissions:** Verify your QuickBooks app has required scopes

### Image won't update

If using `:latest` tag and webhook doesn't pull new image:
- Enable "Re-pull image" in Portainer stack settings
- Or manually pull: `docker pull ghcr.io/herduin/quickbooks-online-mcp-server-http:latest && docker-compose up -d`

## Security

- **Always use `MCP_AUTH_TOKEN`** in production
- **Use HTTPS** (via reverse proxy or tunnel)
- **Rotate tokens** regularly
- **Limit network exposure** (firewall, VPC, etc.)
- **Monitor logs** for suspicious activity
- **Keep image updated** (check for updates weekly)

## Architecture

```
┌─────────────────┐
│   n8n / Client  │
└────────┬────────┘
         │ HTTP/SSE
         ↓
┌─────────────────┐
│  Express Server │
│  (Port 3230)    │
├─────────────────┤
│ Auth Middleware │
├─────────────────┤
│ Streamable HTTP │ ← Recommended
│    Transport    │
├─────────────────┤
│  SSE Transport  │ ← Legacy
├─────────────────┤
│  MCP Server     │
│  (Per Session)  │
├─────────────────┤
│ Tool Registry   │
│  (144 tools)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ QuickBooks API  │
└─────────────────┘
```

## Available Tools

The server provides 144 tools across 29 entity types:

- **Transactions:** Invoice, Bill, Payment, Sales Receipt, Credit Memo, etc.
- **Entities:** Customer, Vendor, Employee, Item, Account
- **Reports:** Balance Sheet, P&L, Cash Flow, General Ledger, etc.
- **Utilities:** Search, List, CRUD operations for all entities

Use `qbo_list_tools` to get a categorized catalog of all available tools.

## Support

- **Issues:** [GitHub Issues](https://github.com/herduin/quickbooks-online-mcp-server/issues)
- **Docs:** [Main README](../README.md)
- **Auth Guide:** [Authentication](../docs/authentication.md)

## License

MIT - see [LICENSE](../LICENSE) file
