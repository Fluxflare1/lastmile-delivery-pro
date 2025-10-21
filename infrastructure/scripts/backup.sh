#!/bin/sh
set -e
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/opt/backups/${TIMESTAMP}"
mkdir -p "${BACKUP_DIR}"

echo "▶ Starting backup at ${TIMESTAMP}"

# PostgreSQL PITR backup
echo "→ Dumping PostgreSQL..."
pg_dump -U postgres -h postgres -Fc --no-acl --no-owner lastmile > "${BACKUP_DIR}/postgres.dump"

# Redis RDB snapshot
echo "→ Backing up Redis..."
cp /data/dump.rdb "${BACKUP_DIR}/redis_dump_${TIMESTAMP}.rdb" 2>/dev/null || true

# Compress all
tar -czf "/opt/backups/backup_${TIMESTAMP}.tar.gz" -C "${BACKUP_DIR}" .
rm -rf "${BACKUP_DIR}"

# Sync to S3
if [ -n "${S3_BUCKET_NAME}" ]; then
  echo "→ Uploading to S3..."
  aws s3 cp "/opt/backups/backup_${TIMESTAMP}.tar.gz" "s3://${S3_BUCKET_NAME}/"
fi

echo "✅ Backup completed: ${TIMESTAMP}"
