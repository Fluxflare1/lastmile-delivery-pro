"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "packages/shared/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface TenantBranding {
  name: string;
  brand_logo: string;
  primary_color: string;
  support_email: string;
}

interface ApiKey {
  id: string;
  key: string;
  created_at: string;
  active: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export default function SettingsPage() {
  const { tenant } = useAuth();
  const [branding, setBranding] = useState<TenantBranding | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const [brandingRes, keysRes, rolesRes] = await Promise.all([
        api.get("/api/v1/tenant/branding", { params: { tenant_id: tenant?.id } }),
        api.get("/api/v1/tenant/api-keys", { params: { tenant_id: tenant?.id } }),
        api.get("/api/v1/tenant/roles", { params: { tenant_id: tenant?.id } }),
      ]);
      setBranding(brandingRes.data.data);
      setApiKeys(keysRes.data.data);
      setRoles(rolesRes.data.data);
    } catch {
      toast.error("Failed to load tenant settings");
    } finally {
      setLoading(false);
    }
  };

  const handleBrandingSave = async () => {
    setSaving(true);
    try {
      await api.put("/api/v1/tenant/branding", {
        tenant_id: tenant?.id,
        ...branding,
      });
      toast.success("Branding updated successfully");
    } catch {
      toast.error("Error updating branding");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateApiKey = async () => {
    try {
      const res = await api.post("/api/v1/tenant/api-keys", { tenant_id: tenant?.id });
      setApiKeys((prev) => [...prev, res.data.data]);
      toast.success("API key created successfully");
    } catch {
      toast.error("Failed to create API key");
    }
  };

  const toggleApiKey = async (id: string, active: boolean) => {
    try {
      await api.patch(`/api/v1/tenant/api-keys/${id}`, { active });
      setApiKeys((prev) =>
        prev.map((k) => (k.id === id ? { ...k, active } : k))
      );
      toast.success("API key updated");
    } catch {
      toast.error("Error updating API key");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [tenant?.id]);

  if (loading)
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );

  return (
    <div className="space-y-10">
      {/* ========== BRANDING ========== */}
      <Card>
        <CardHeader>
          <CardTitle>Brand & Company Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Business Name</Label>
            <Input
              value={branding?.name || ""}
              onChange={(e) =>
                setBranding((prev) => ({ ...prev!, name: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Support Email</Label>
            <Input
              value={branding?.support_email || ""}
              onChange={(e) =>
                setBranding((prev) => ({ ...prev!, support_email: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Primary Color</Label>
            <Input
              type="color"
              value={branding?.primary_color || "#3B82F6"}
              onChange={(e) =>
                setBranding((prev) => ({ ...prev!, primary_color: e.target.value }))
              }
              className="w-24 h-10 p-1 border"
            />
          </div>

          <Button disabled={saving} onClick={handleBrandingSave}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* ========== API KEYS ========== */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys & Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleCreateApiKey}>Generate New API Key</Button>
          <div className="grid gap-3">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-mono text-sm">{key.key}</p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(key.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={key.active}
                    onCheckedChange={(checked) => toggleApiKey(key.id, checked)}
                  />
                  <span className="text-xs">{key.active ? "Active" : "Inactive"}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ========== ROLE MANAGEMENT ========== */}
      <Card>
        <CardHeader>
          <CardTitle>Role & Permission Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900"
              >
                <h3 className="font-semibold">{role.name}</h3>
                <p className="text-sm text-gray-500">{role.description}</p>
                <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                  {role.permissions.map((perm) => (
                    <li key={perm}>{perm}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
