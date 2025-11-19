#!/bin/sh
echo "Waiting for Redis..."
while ! nc -z redis 6379; do sleep 1; done
echo "Starting Celery Beat..."
celery -A src.config.celery beat --loglevel=INFO
