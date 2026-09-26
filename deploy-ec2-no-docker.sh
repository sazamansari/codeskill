#!/bin/bash
set -e

echo "============================================="
echo "   CodeSkill EC2 Setup (NO DOCKER)           "
echo "============================================="

# 1. Update and install basic dependencies
echo "[1/8] Updating system..."
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl wget git build-essential

# 2. Install Sandbox Execution Dependencies
echo "[2/8] Installing sandbox dependencies (Java, Python, G++)..."
sudo apt-get install -y openjdk-17-jdk python3 g++

# 3. Install Node.js
echo "[3/8] Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# 4. Install MongoDB & Redis directly on host
echo "[4/8] Installing MongoDB and Redis..."
sudo apt-get install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# MongoDB installation (Ubuntu 22.04 example)
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod

# 5. Setup Project Env Files (Placeholder)
echo "[5/8] Setting up environment files..."
if [ ! -f backend-nestjs/.env ]; then
  echo "PORT=5001" > backend-nestjs/.env
  echo "DATABASE_URI=mongodb://localhost:27017/codeskill" >> backend-nestjs/.env
  echo "REDIS_HOST=localhost" >> backend-nestjs/.env
  echo "REDIS_PORT=6379" >> backend-nestjs/.env
  echo "JWT_SECRET=super_secret_jwt_key_here" >> backend-nestjs/.env
  echo "# AWS_REGION=us-east-1" >> backend-nestjs/.env
  echo "# AWS_ACCESS_KEY_ID=" >> backend-nestjs/.env
  echo "# AWS_SECRET_ACCESS_KEY=" >> backend-nestjs/.env
  echo "# AWS_S3_BUCKET_NAME=" >> backend-nestjs/.env
fi

if [ ! -f frontend-v2/.env.local ]; then
  echo "NEXT_PUBLIC_API_URL=http://your-ec2-ip:5001" > frontend-v2/.env.local
fi

# 6. Build Backend
echo "[6/8] Building Backend..."
cd backend-nestjs
npm install
npm run build
cd ..

# 7. Build Frontend
echo "[7/8] Building Frontend..."
cd frontend-v2
npm install
npm run build
cd ..

# 8. Start with PM2
echo "[8/8] Starting applications with PM2..."
cd backend-nestjs
pm2 start dist/main.js --name "codeskill-backend"
cd ..

cd frontend-v2
pm2 start npm --name "codeskill-frontend" -- start
cd ..

# Save PM2 process list so they start on reboot
pm2 save
pm2 startup | sudo bash

echo "============================================="
echo "   Setup Complete!                           "
echo "============================================="
echo "Backend running on port 5001"
echo "Frontend running on port 3000"
echo "Remember to edit your .env files and add your AWS S3 credentials!"
