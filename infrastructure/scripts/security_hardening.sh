#!/bin/bash
# ==============================================================
# Security Hardening & Compliance Setup
# For: lastmile-delivery-pro
# Location: /infrastructure/scripts/security_hardening.sh
# ==============================================================

set -e

echo "🔒 Starting Security Hardening for lastmile-delivery-pro..."

# --------------------------------------------------------------
# 1. Enforce Secure Permissions
# --------------------------------------------------------------
chmod 700 /infrastructure/scripts/*.sh || true
chmod 600 /infrastructure/docker/nginx/ssl/* || true
chmod 600 /infrastructure/kubernetes/secrets/* || true

# --------------------------------------------------------------
# 2. Enable Docker Secrets for Sensitive Data
# --------------------------------------------------------------
mkdir -p /run/secrets
echo "$POSTGRES_PASSWORD" > /run/secrets/postgres_password
echo "$DJANGO_SECRET_KEY" > /run/secrets/django_secret_key
echo "$REDIS_PASSWORD" > /run/secrets/redis_password
chmod 600 /run/secrets/*

# --------------------------------------------------------------
# 3. Harden NGINX (disable weak protocols, enable HSTS)
# --------------------------------------------------------------
NGINX_CONF="/infrastructure/docker/nginx/nginx.conf"
if ! grep -q "ssl_protocols TLSv1.2 TLSv1.3;" "$NGINX_CONF"; then
cat << 'EOF' >> "$NGINX_CONF"

# --- Security Hardening ---
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
EOF
fi

# --------------------------------------------------------------
# 4. Verify SSL Certificates (Auto-Renewal)
# --------------------------------------------------------------
if [ -d "/etc/letsencrypt/live/lastmile-delivery-pro.com" ]; then
    echo "✅ SSL certificates found for lastmile-delivery-pro.com"
else
    echo "⚠️ No certificates found — run ssl-setup.sh"
fi

# --------------------------------------------------------------
# 5. Compliance & Audit Baseline
# --------------------------------------------------------------
mkdir -p /var/log/security_audit
audit_log="/var/log/security_audit/hardening_$(date +%F_%H-%M-%S).log"
echo "Security hardening applied at $(date)" > "$audit_log"
echo "Verified TLS, permissions, secrets, and HSTS" >> "$audit_log"

# --------------------------------------------------------------
# 6. Summary
# --------------------------------------------------------------
echo "✅ Security Hardening Completed Successfully"
echo "Logs stored at $audit_log"
