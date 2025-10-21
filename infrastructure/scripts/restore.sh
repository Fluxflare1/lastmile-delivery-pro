#!/bin/sh
# Usage: ./restore.sh backup_20251020_010101.tar.gz
set -e
FILE=$1
[ -z "$FILE" ] && echo "Usage: restore.sh <file>" && exit 1
tar -xzf "/opt/backups/$FILE" -C /opt/backups/tmp
pg_restore -U postgres -h postgres -d lastmile --clean --if-exists /opt/backups/tmp/postgres.dump
echo "✅ Database restored from $FILE"
