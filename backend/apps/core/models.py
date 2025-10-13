"""
Core models for Last Mile Delivery Services Pro (LMDSP)
--------------------------------------------------------
This module defines base models, abstract mixins, and shared behaviors
used across all Django apps (accounts, orders, billing, couriers, etc.).

Author: LMDSP Engineering Team
Date: 2025
"""

import os
import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError


# =====================================================
# Utility functions
# =====================================================

def generate_file_path(instance, filename):
    """
    Generates standardized upload path for media files.
    Format: media/<tenant_uuid>/<model_name>/<filename>
    """
    tenant_id = getattr(instance, "tenant_id", "global")
    model_name = instance.__class__.__name__.lower()
    return os.path.join(str(tenant_id), model_name, filename)


# =====================================================
# Base Mixins
# =====================================================

class TimeStampedModel(models.Model):
    """
    Adds created_at and updated_at timestamps to inheriting models.
    """
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']


class SoftDeleteModel(models.Model):
    """
    Implements soft delete functionality.
    Records are not physically deleted, but marked as deleted.
    """
    is_deleted = models.BooleanField(default=False, db_index=True)

    def delete(self, using=None, keep_parents=False):
        """Soft delete the record instead of removing from DB."""
        self.is_deleted = True
        self.save(update_fields=['is_deleted', 'updated_at'])

    def restore(self):
        """Restore a previously deleted record."""
        self.is_deleted = False
        self.save(update_fields=['is_deleted', 'updated_at'])

    class Meta:
        abstract = True


class TenantAwareModel(models.Model):
    """
    Adds tenant context to models.
    Every record is tied to a tenant (LMDSP, DCSD, etc.)
    """
    tenant = models.ForeignKey(
        'accounts.Tenant',
        on_delete=models.CASCADE,
        related_name='%(class)s_tenant',
        null=True,
        blank=True
    )

    class Meta:
        abstract = True


class AuditModel(models.Model):
    """
    Tracks user actions (created_by, updated_by) across models.
    These references are optional to allow system-generated records.
    """
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='%(class)s_created',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='%(class)s_updated',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    class Meta:
        abstract = True


# =====================================================
# Core Base Model
# =====================================================

class BaseModel(TimeStampedModel, SoftDeleteModel, TenantAwareModel, AuditModel):
    """
    Combines all core model mixins for convenience.
    Inherit this in any model that should:
      • Support timestamps
      • Be soft-deletable
      • Be tenant-aware
      • Track created_by / updated_by
    """
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)

    class Meta:
        abstract = True


# =====================================================
# Media Support Models
# =====================================================

class MediaAsset(BaseModel):
    """
    Generic model to store uploaded media assets.
    Used for courier documents, profile photos, POD images, etc.
    """
    file = models.FileField(upload_to=generate_file_path)
    file_type = models.CharField(max_length=50, help_text="e.g., image/jpeg, application/pdf")
    description = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return os.path.basename(self.file.name)


class SystemConfig(TimeStampedModel):
    """
    Key-value store for environment or tenant-specific settings.
    Used for runtime configuration (e.g., rate limits, email templates, etc.)
    """
    key = models.CharField(max_length=150, unique=True)
    value = models.TextField()
    description = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def clean(self):
        if not self.key.isupper():
            raise ValidationError("Config key must be uppercase (e.g., MAX_RETRIES).")

    def __str__(self):
        return f"{self.key} = {self.value}"

    class Meta:
        verbose_name = "System Configuration"
        verbose_name_plural = "System Configurations"
        ordering = ['key']


# =====================================================
# Global Utility Classes
# =====================================================

class AuditLog(BaseModel):
    """
    Global audit log capturing create/update/delete actions across tenants.
    Can be extended by signals or Celery event listeners.
    """
    model_name = models.CharField(max_length=100)
    object_uuid = models.UUIDField()
    action = models.CharField(
        max_length=20,
        choices=[
            ('CREATE', 'Create'),
            ('UPDATE', 'Update'),
            ('DELETE', 'Delete'),
            ('RESTORE', 'Restore'),
            ('LOGIN', 'Login'),
            ('LOGOUT', 'Logout')
        ]
    )
    metadata = models.JSONField(blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"[{self.action}] {self.model_name} ({self.object_uuid})"

    class Meta:
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"
        ordering = ['-timestamp']


# =====================================================
# Example base manager (optional but recommended)
# =====================================================

class ActiveManager(models.Manager):
    """Manager to filter only active (non-deleted) records."""
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# Assign default manager to key models
BaseModel.add_to_class('objects', ActiveManager())
MediaAsset.add_to_class('objects', ActiveManager())
AuditLog.add_to_class('objects', ActiveManager())
SystemConfig.add_to_class('objects', ActiveManager())
