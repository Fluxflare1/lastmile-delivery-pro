#!/bin/bash
# =========================================================
# Notification Script (Slack + Email)
# For SSL Renewal and NGINX Reload Events
# =========================================================

set -e

# Load environment
source /usr/src/app/infrastructure/scripts/.env || true

SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL}"
SMTP_SERVER="${SMTP_SERVER}"
SMTP_PORT="${SMTP_PORT}"
SMTP_USERNAME="${SMTP_USERNAME}"
SMTP_PASSWORD="${SMTP_PASSWORD}"
EMAIL_FROM="${EMAIL_FROM}"
EMAIL_TO="${EMAIL_TO}"

send_slack() {
    local message="$1"
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"${message}\"}" "$SLACK_WEBHOOK_URL" >/dev/null 2>&1
    fi
}

send_email() {
    local subject="$1"
    local body="$2"
    if [ -n "$SMTP_SERVER" ]; then
        {
            echo "From: ${EMAIL_FROM}"
            echo "To: ${EMAIL_TO}"
            echo "Subject: ${subject}"
            echo ""
            echo "${body}"
        } | curl --url "smtp://${SMTP_SERVER}:${SMTP_PORT}" \
                 --ssl-reqd \
                 --mail-from "${EMAIL_FROM}" \
                 --mail-rcpt "${EMAIL_TO}" \
                 --user "${SMTP_USERNAME}:${SMTP_PASSWORD}" \
                 -T -
    fi
}
