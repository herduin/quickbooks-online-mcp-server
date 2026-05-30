# Multi-stage Dockerfile for QuickBooks MCP HTTP Server
# Optimized for production deployment with multi-arch support

# ========== Stage 1: Build TypeScript ==========
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files from both docker/ and parent for dependencies
COPY docker/package*.json ./
COPY package*.json ../

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy parent src (tools, handlers, etc.)
COPY src ../src

# Copy docker src (HTTP server)
COPY docker/src ./src
COPY docker/tsconfig.json ./

# Build TypeScript
RUN npm run build

# ========== Stage 2: Production Image ==========
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S mcpuser && \
    adduser -S -u 1001 -G mcpuser mcpuser

WORKDIR /app

# Copy built application
COPY --from=builder --chown=mcpuser:mcpuser /build/dist ./dist
COPY --from=builder --chown=mcpuser:mcpuser /build/node_modules ./node_modules
COPY --from=builder --chown=mcpuser:mcpuser /build/package.json ./

# Copy parent built files (tools, handlers, clients)
COPY --from=builder --chown=mcpuser:mcpuser /src ../src

# Switch to non-root user
USER mcpuser

# Expose port
EXPOSE 3230

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3230/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the server
CMD ["node", "dist/index.js"]
