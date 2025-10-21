#!/bin/sh
set -e
LATEST=$(ls -t /opt/backups/backup_*.tar.gz | head -n 1)
[ -z "$LATEST" ] && echo "No backup found!" && exit 1
tar -tzf "$LATEST" >/dev/null && echo "✅ Verified $LATEST" || echo "❌ Corrupt backup"
