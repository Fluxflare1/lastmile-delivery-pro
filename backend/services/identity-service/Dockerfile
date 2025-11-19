# ==============================
# Stage 1: Build dependencies
# ==============================
FROM python:3.11-slim AS builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && pip wheel --no-cache-dir --no-deps -r requirements.txt -w wheels

# ==============================
# Stage 2: Production runtime
# ==============================
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    netcat-traditional curl libpq-dev gettext \
    && rm -rf /var/lib/apt/lists/*

# Copy from builder
COPY --from=builder /app/wheels /wheels
RUN pip install --no-cache-dir /wheels/*

# Copy project files
COPY src /app

# Create non-root user
RUN adduser --disabled-password appuser
USER appuser

# Expose port
EXPOSE 8000

# Entry point
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4", "--threads", "4"]
