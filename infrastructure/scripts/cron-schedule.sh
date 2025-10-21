# Daily full backup at 02:00 UTC
0 2 * * * /opt/backup/scripts/backup.sh >> /var/log/backup.log 2>&1
# Verify every Sunday
0 3 * * 0 /opt/backup/scripts/verify-backup.sh >> /var/log/backup.log 2>&1
