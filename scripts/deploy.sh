#!/bin/bash
# CodeSkill Production Deployment Script

set -e

echo "Starting Deployment..."

# 1. Pull latest code
echo "Pulling latest code from git..."
git pull origin main

# 2. Update and Build Backend
echo "Updating and building Backend (NestJS)..."
cd backend-nestjs
npm install
npm run build
cd ..

# 3. Update and Build Frontend
echo "Updating and building Frontend (Next.js)..."
cd frontend-v2
npm install
npm run build
cd ..

# 4. Restart PM2 Ecosystem
echo "Restarting PM2 processes..."
pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js
pm2 save

echo "Deployment Successful!"
