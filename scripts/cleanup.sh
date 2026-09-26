#!/bin/bash
# CodeSkill Cleanup Script

echo "Starting Server Cleanup..."

# 1. PM2 Logs Cleanup
echo "Cleaning PM2 logs..."
pm2 flush

# 2. NPM Cache Cleanup
echo "Cleaning NPM cache..."
npm cache clean --force

# 3. Old Next.js Build Cache Cleanup
echo "Cleaning Next.js cache..."
rm -rf ../frontend-v2/.next/cache

# 4. Flush Redis (Optional/Dangerous if storing active sessions)
# echo "Flushing Redis Cache..."
# redis-cli FLUSHALL

echo "Cleanup completed successfully!"
