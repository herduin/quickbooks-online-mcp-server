#!/bin/bash
set -e

echo "====================================="
echo "QuickBooks MCP HTTP Server - Test Build"
echo "====================================="
echo

# Change to repository root
cd "$(dirname "$0")/.."

echo "Step 1: Building parent TypeScript project..."
npm run build
echo "✓ Parent project built successfully"
echo

echo "Step 2: Installing Docker dependencies..."
cd docker
npm install
echo "✓ Docker dependencies installed"
echo

echo "Step 3: Building Docker TypeScript..."
npm run build
echo "✓ Docker TypeScript built successfully"
echo

echo "Step 4: Building Docker image..."
cd ..
docker build -f docker/Dockerfile -t qbo-mcp-server:test .
echo "✓ Docker image built successfully"
echo

echo "Step 5: Checking image size..."
docker images qbo-mcp-server:test --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
echo

echo "====================================="
echo "✓ All tests passed!"
echo "====================================="
echo
echo "To run the server locally:"
echo "  docker run -p 3230:3230 --env-file docker/.env qbo-mcp-server:test"
echo
echo "To test endpoints:"
echo "  curl http://localhost:3230/health"
echo "  curl http://localhost:3230/version"
echo
