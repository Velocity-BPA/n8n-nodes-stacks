#!/bin/bash
# Copyright (c) Velocity BPA, LLC
# Licensed under the Business Source License 1.1
# Commercial use requires a separate commercial license.
# See LICENSE file for details.

set -e

echo "🏗️ Building n8n-nodes-stacks..."

# Clean previous build
rm -rf dist/

# Install dependencies
pnpm install

# Run build
pnpm run build

echo "✅ Build complete!"
