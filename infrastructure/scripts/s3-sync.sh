#!/bin/sh
set -e
echo "→ Syncing backups to S3..."
aws s3 sync /opt/backups "s3://${S3_BUCKET_NAME}/" --delete
echo "✅ Sync complete"
