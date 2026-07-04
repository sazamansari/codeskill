#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=================================="
echo " Starting CodeSkill Build Process "
echo "=================================="

# 1. Backend Build Process
echo "--> Installing backend dependencies..."
cd backend
npm install --production
cd ..

# 2. Frontend Build Process
echo "--> Installing frontend dependencies..."
cd frontend-v2
npm install
echo "--> Building frontend (Next.js)..."
npm run build
cd ..

echo "=================================="
echo " Build Completed Successfully!    "
echo "=================================="
echo "To start the production servers, run:"
echo "  pm2 start ecosystem.config.js"
echo "Or using npm:"
echo "  npm start"
