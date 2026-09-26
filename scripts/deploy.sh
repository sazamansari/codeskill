#!/bin/bash
# CodeSkill Production Deployment Script

set -e

echo "Starting Deployment..."

# 1. Pull latest code
echo "Pulling latest code from git..."
git pull origin main

# 2. Update Backend
echo "Updating Backend..."
cd backend
npm install --production
npm prune --production
cd ..

# 3. Update Frontend
echo "Updating Frontend..."
cd frontend-v2
npm install
npm run build
npm prune --production
cd ..

# 4. Restart PM2 Ecosystem
echo "Restarting PM2 processes..."
pm2 reload ecosystem.config.js --update-env
pm2 save

echo "Deployment Successful!"
