#!/bin/bash
# =========================================================
# Cron Job Setup for SSL Certificate Auto-Renewal
# =========================================================
# Runs every 12 hours to renew certificates and reload NGINX.
# =========================================================

CRON_FILE="/etc/cron.d/ssl_renewal"

echo "🕒 Installing cron job for SSL auto-renewal..."

# Create cron job file
cat <<EOF > $CRON_FILE
0 */12 * * * root /bin/bash /usr/src/app/infrastructure/scripts/ssl-renew.sh >> /var/log/ssl_renewal.log 2>&1
EOF

# Apply cron permissions
chmod 0644 $CRON_FILE
crontab $CRON_FILE

echo "✅ SSL auto-renewal cron job installed successfully."
