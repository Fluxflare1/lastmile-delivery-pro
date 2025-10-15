#!/bin/bash

# ============================================================
# Generate HTTPS SSL Certificates for Local Development
# using mkcert (trusted locally by browsers)
# ============================================================

set -e

CERT_DIR="./frontend/nginx/ssl"
DOMAIN="www.lastmile-delivery-pro.com"

echo "🔧 Checking if mkcert is installed..."
if ! command -v mkcert &> /dev/null
then
    echo "⚠️  mkcert not found. Installing mkcert..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt update && sudo apt install -y libnss3-tools
        sudo curl -L -o /usr/local/bin/mkcert https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v1.4.4-linux-amd64
        sudo chmod +x /usr/local/bin/mkcert
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install mkcert nss
    elif [[ "$OSTYPE" == "msys" ]]; then
        choco install mkcert -y
    fi
fi

echo "📁 Creating SSL directory at $CERT_DIR"
mkdir -p $CERT_DIR

echo "🔐 Generating local CA and certificates..."
mkcert -install
mkcert -cert-file "${CERT_DIR}/fullchain.pem" -key-file "${CERT_DIR}/privkey.pem" "$DOMAIN" "localhost" 127.0.0.1 ::1

echo "✅ SSL certificates generated successfully!"
echo "📂 Files saved at: ${CERT_DIR}"
