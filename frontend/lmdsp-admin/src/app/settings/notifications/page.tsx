"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "packages/shared/context/AuthContext";

export default function NotificationSettings() {
  const { tenant, user } = useAuth();
  const [prefs, setPrefs] = useState({
    email: true,
    sms: false,
    in_app: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPrefs = async () => {
      const res = await api.get(`/api/v1/notifications/preferences`, {
        params: { tenant_id: tenant?.id, user_id: user?.id },
      });
      setPrefs(res.data.data);
    };
    if (tenant?.id && user?.id) loadPrefs();
  }, [tenant?.id, user?.id]);

  const savePrefs = async () => {
    try {
      setSaving(true);
      await api.put(`/api/v1/notifications/preferences`, {
        tenant_id: tenant?.id,
        user_id: user?.id,
        ...prefs,
      });
      toast.success("Preferences saved successfully");
    } catch {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {["email", "sms", "in_app"].map((type) => (
          <div key={type} className="flex justify-between items-center">
            <span className="capitalize">{type.replace("_", " ")} Notifications</span>
            <Switch
              checked={prefs[type as keyof typeof prefs]}
              onCheckedChange={(val) =>
                setPrefs((prev) => ({ ...prev, [type]: val }))
              }
            />
          </div>
        ))}
        <Button onClick={savePrefs} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
