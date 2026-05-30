# Multi-stage Dockerfile for QuickBooks MCP HTTP Server
# Optimized for production deployment with multi-arch support

# ========== Stage 1: Build Parent TypeScript ==========
FROM node:20-alpine AS parent-builder

WORKDIR /build

# Copy parent package files
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy parent source
COPY src ./src
COPY tsconfig.json ./

# Build parent TypeScript
RUN npm run build

# ========== Stage 2: Build Docker TypeScript ==========
FROM node:20-alpine AS docker-builder

WORKDIR /build

# Copy docker package files
COPY docker/package*.json ./docker/
RUN cd docker && npm ci && npm cache clean --force

# Copy docker source
COPY docker/src ./docker/src
COPY docker/tsconfig.json ./docker/

# Build docker TypeScript
RUN cd docker && npm run build

# ========== Stage 3: Production Image ==========
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S mcpuser && \
    adduser -S -u 1001 -G mcpuser mcpuser

WORKDIR /app

# Copy parent built files and source (needed for imports)
COPY --from=parent-builder --chown=mcpuser:mcpuser /build/dist ./src
COPY --from=parent-builder --chown=mcpuser:mcpuser /build/node_modules ./node_modules

# Copy docker built files
COPY --from=docker-builder --chown=mcpuser:mcpuser /build/docker/dist ./docker/dist
COPY --from=docker-builder --chown=mcpuser:mcpuser /build/docker/node_modules ./docker/node_modules
COPY --from=docker-builder --chown=mcpuser:mcpuser /build/docker/package.json ./docker/

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
CMD ["node", "docker/dist/index.js"]
