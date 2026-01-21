#!/bin/bash
# Copyright (c) Velocity BPA, LLC
# Licensed under the Business Source License 1.1
# Commercial use requires a separate commercial license.
# See LICENSE file for details.

set -e

echo "🧪 Running n8n-nodes-stacks tests..."

# Run linting
echo "📝 Running ESLint..."
npm run lint

# Run unit tests
echo "🔬 Running unit tests..."
npm test

# Run build to verify compilation
echo "🏗️ Verifying build..."
npm run build

echo "✅ All tests passed!"
