#!/bin/bash

# Backup current package.json
cp package.json package.json.backup

# Install new dependencies
echo "Installing Next.js 15 dependencies..."
cp package.json.new package.json
npm install

# Create necessary directories if they don't exist
mkdir -p app
mkdir -p components/ui
mkdir -p lib
mkdir -p hooks

echo "Migration script completed. Run 'npm run dev' to start the development server."