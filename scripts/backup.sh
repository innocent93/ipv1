#!/bin/bash
# MongoDB Backup Script for IPMC
# Run daily via cron: 0 2 * * * /path/to/backup.sh

set -e

BACKUP_DIR="/var/backups/ipmc-mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
MONGO_URI="${MONGODB_URI:-mongodb://localhost:27017/ipmc}"
S3_BUCKET="${S3_BACKUP_BUCKET:-}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Run mongodump
echo "[$(date)] Starting MongoDB backup..."
mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/backup_$DATE"

# Compress
cd "$BACKUP_DIR"
tar -czf "backup_$DATE.tar.gz" "backup_$DATE"
rm -rf "backup_$DATE"

# Upload to S3 if configured
if [ -n "$S3_BUCKET" ]; then
  aws s3 cp "backup_$DATE.tar.gz" "s3://$S3_BUCKET/backups/"
  echo "[$(date)] Uploaded to S3: s3://$S3_BUCKET/backups/backup_$DATE.tar.gz"
fi

# Cleanup old backups (local)
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Cleanup old S3 backups
if [ -n "$S3_BUCKET" ]; then
  aws s3 ls "s3://$S3_BUCKET/backups/" | awk '{print $4}' | sort -r | tail -n +31 | xargs -I {} aws s3 rm "s3://$S3_BUCKET/backups/{}"
fi

echo "[$(date)] Backup complete: backup_$DATE.tar.gz"
