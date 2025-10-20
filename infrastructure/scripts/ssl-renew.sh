#!/bin/bash
# =========================================================
# SSL Certificate Auto-Renewal with Alerts
# lastmile-delivery-pro.com
# =========================================================

set -e

DOMAIN="lastmile-delivery-pro.com"
NGINX_CONTAINER="nginx-gateway"
CERTBOT_CONTAINER="certbot"
SCRIPT_PATH="/usr/src/app/infrastructure/scripts"
NOTIFY_SCRIPT="$SCRIPT_PATH/notify.sh"
LOG_FILE="/var/log/certbot/renewal.log"

# Create log directory if it doesn't exist
mkdir -p $(dirname "$LOG_FILE")

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Source notification functions if available
if [ -f "$NOTIFY_SCRIPT" ]; then
    source "$NOTIFY_SCRIPT"
else
    # Fallback notification functions
    send_slack() {
        log "SLACK_NOTIFICATION: $1"
    }
    send_email() {
        log "EMAIL_NOTIFICATION: $2"
    }
fi

renew_certificates() {
    log "🔐 Starting certificate renewal for $DOMAIN..."
    
    if docker compose run --rm $CERTBOT_CONTAINER renew --quiet --no-self-upgrade; then
        log "✅ Certificate renewal successful"
        return 0
    else
        log "❌ Certificate renewal failed"
        return 1
    fi
}

cleanup_containers() {
    log "🧹 Cleaning up Docker system..."
    docker system prune -f
}

reload_nginx() {
    log "♻️ Reloading NGINX configuration..."
    
    if docker compose exec $NGINX_CONTAINER nginx -s reload; then
        log "✅ NGINX reloaded successfully"
        return 0
    else
        log "⚠️ NGINX reload failed, attempting container restart..."
        if docker compose restart $NGINX_CONTAINER; then
            log "✅ NGINX container restarted successfully"
            return 0
        else
            log "❌ NGINX restart failed"
            return 1
        fi
    fi
}

check_expiry() {
    local cert_path="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"
    
    if docker compose exec $NGINX_CONTAINER test -f "$cert_path"; then
        local expiry_date=$(docker compose exec $NGINX_CONTAINER openssl x509 -enddate -noout -in "$cert_path" | cut -d= -f2)
        local expiry_timestamp=$(date -d "$expiry_date" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y" "$expiry_date" +%s 2>/dev/null)
        local current_timestamp=$(date +%s)
        local days_left=$(( ($expiry_timestamp - $current_timestamp) / 86400 ))
        
        log "📅 Certificate expires on: $expiry_date ($days_left days remaining)"
        echo "$days_left"
    else
        log "❌ Certificate file not found: $cert_path"
        echo "-1"
    fi
}

check_certificate_health() {
    log "🏥 Performing certificate health check..."
    
    local days_left=$(check_expiry)
    
    if [ "$days_left" -eq "-1" ]; then
        local message="❌ CRITICAL: SSL certificate for *$DOMAIN* not found or inaccessible!"
        send_slack "$message"
        send_email "SSL Certificate Missing - $DOMAIN" "$message"
        return 1
    elif [ "$days_left" -lt 5 ]; then
        local message="🚨 URGENT: SSL Certificate for *$DOMAIN* expires in ${days_left} days!"
        send_slack "$message"
        send_email "SSL Expiry Alert - $DOMAIN" "$message"
        return 1
    elif [ "$days_left" -lt 15 ]; then
        local message="⚠️ WARNING: SSL Certificate for *$DOMAIN* expires in ${days_left} days. Renewal needed soon."
        send_slack "$message"
        send_email "SSL Expiry Warning - $DOMAIN" "$message"
        return 0
    else
        log "✅ Certificate health check passed: $days_left days until expiry"
        return 0
    fi
}

main() {
    log "🚀 Starting SSL certificate maintenance process..."
    
    # First check current certificate health
    if ! check_certificate_health; then
        log "⚠️ Certificate health check failed, attempting renewal..."
    fi
    
    # Attempt certificate renewal
    if renew_certificates; then
        cleanup_containers
        
        if reload_nginx; then
            # Verify the renewal was successful
            local days_left=$(check_expiry)
            
            if [ "$days_left" -gt 0 ]; then
                local message="✅ SSL certificate renewed successfully for *$DOMAIN*. Next expiry in ${days_left} days."
                send_slack "$message"
                send_email "SSL Renewal Success - $DOMAIN" "$message"
                log "✅ SSL certificate renewal process completed successfully"
            else
                local message="❌ SSL certificate renewal completed but expiry check failed for *$DOMAIN*."
                send_slack "$message"
                send_email "SSL Renewal Issue - $DOMAIN" "$message"
                log "❌ Renewal completed but expiry verification failed"
                return 1
            fi
        else
            local message="❌ SSL certificate renewed but NGINX reload failed for *$DOMAIN*!"
            send_slack "$message"
            send_email "NGINX Reload Failed - $DOMAIN" "$message"
            log "❌ Certificate renewed but NGINX reload failed"
            return 1
        fi
    else
        local message="❌ SSL certificate renewal FAILED for *$DOMAIN*! Manual intervention required."
        send_slack "$message"
        send_email "SSL Renewal Failed - $DOMAIN" "$message"
        log "❌ Certificate renewal failed"
        return 1
    fi
}

# Handle script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
