#!/bin/bash
# CodeSkill Database Backup Script
# Run via cron daily: 0 2 * * * /var/www/codeskill/scripts/backup.sh

set -e

BACKUP_DIR="../backups/daily"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_URI=$(grep MONGODB_URI ../backend/.env | cut -d '=' -f2)

mkdir -p $BACKUP_DIR

echo "Starting MongoDB backup..."
# Assuming mongodump is installed on the server
mongodump --uri="$DB_URI" --out="$BACKUP_DIR/db_backup_$TIMESTAMP"
# Compress the backup
tar -czvf $BACKUP_DIR/db_backup_$TIMESTAMP.tar.gz -C $BACKUP_DIR db_backup_$TIMESTAMP
# Remove uncompressed folder
rm -rf $BACKUP_DIR/db_backup_$TIMESTAMP

# Delete backups older than 7 days
find $BACKUP_DIR -type f -name "*.tar.gz" -mtime +7 -delete

echo "Backup successful: $BACKUP_DIR/db_backup_$TIMESTAMP.tar.gz"
