#!/bin/bash
# =========================================================
# SSL Certificate Auto-Renewal Script for lastmile-delivery-pro.com
# =========================================================
# This script renews Let's Encrypt certificates and gracefully
# reloads the NGINX container to apply new certificates.
# 
# Author: DevOps Engineering - lastmile-delivery-pro
# =========================================================

set -e

DOMAIN="lastmile-delivery-pro.com"
NGINX_CONTAINER="nginx"
CERTBOT_CONTAINER="certbot"

echo "🔐 Starting SSL certificate renewal for $DOMAIN..."

# Renew certificates
docker compose run --rm $CERTBOT_CONTAINER renew --quiet --no-self-upgrade

# Cleanup old containers
docker system prune -f

# Reload NGINX to apply new certificates
echo "♻️ Reloading NGINX configuration..."
docker compose exec $NGINX_CONTAINER nginx -s reload || {
    echo "❌ Failed to reload NGINX. Restarting container instead..."
    docker compose restart $NGINX_CONTAINER
}

# Verify certificate expiration
echo "📅 Checking new certificate expiry date:"
docker compose exec $NGINX_CONTAINER openssl x509 -enddate -noout -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem

echo "✅ SSL certificate renewal and reload completed successfully."
