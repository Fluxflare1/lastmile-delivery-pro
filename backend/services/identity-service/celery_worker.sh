#!/bin/sh
echo "Waiting for PostgreSQL and Redis..."
while ! nc -z db 5432; do sleep 1; done
while ! nc -z redis 6379; do sleep 1; done
echo "Starting Celery Worker..."
celery -A src.config.celery worker --loglevel=INFO
