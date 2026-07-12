#!/bin/bash
# CodeSkill EC2 Deployment Script
# Run this script on a fresh Ubuntu 22.04/24.04 EC2 instance to deploy the platform

echo "=========================================="
echo "🚀 Starting CodeSkill EC2 Deployment Setup"
echo "=========================================="

# 1. Update system packages
echo "[1/4] Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Docker & Docker Compose
echo "[2/4] Installing Docker and Docker Compose..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker installed successfully."
else
    echo "✅ Docker is already installed."
fi

# Ensure Docker Compose plugin is available
sudo apt-get install docker-compose-plugin -y

# 3. Pull required Sandbox images so the Backend Judge doesn't timeout on first run
echo "[3/4] Pulling Docker Sandbox Images for the Judge..."
sudo docker pull node:18-alpine
sudo docker pull python:3.9-alpine
sudo docker pull gcc:11
sudo docker pull eclipse-temurin:17-alpine
echo "✅ Sandbox images ready."

# 4. Start the Application
echo "[4/4] Starting CodeSkill Stack (Frontend, Backend, Redis, Mongo)..."
# Build and start in detached mode
sudo docker compose up --build -d

echo "=========================================="
echo "🎉 Deployment Complete!"
echo "=========================================="
echo "Your frontend is running on: http://<YOUR_EC2_PUBLIC_IP>:3000"
echo "Your backend API is on: http://<YOUR_EC2_PUBLIC_IP>:5001"
echo ""
echo "Note: If you encounter permission issues with Docker out of Docker (DooD), run:"
echo "sudo chmod 666 /var/run/docker.sock"
echo "=========================================="
