#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=================================="
echo " Starting CodeSkill Build Process "
echo "=================================="

# 1. Backend Build Process
echo "--> Installing backend dependencies..."
cd backend-nestjs
npm install
echo "--> Building backend (NestJS)..."
npm run build
cd ..

# 2. Frontend Build Process
echo "--> Installing frontend dependencies..."
cd frontend-v2
npm install
echo "--> Building frontend (Next.js)..."
npm run build
cd ..

# 3. Create logs directory for PM2
mkdir -p logs

echo "=================================="
echo " Build Completed Successfully!    "
echo "=================================="
echo "To start/restart production servers with PM2, run:"
echo "  pm2 start ecosystem.config.js"
echo "Or:"
echo "  pm2 restart ecosystem.config.js --update-env"
