"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Bell, Mail, Smartphone } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "packages/shared/context/AuthContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "payment" | "system" | "courier";
  channel: "email" | "sms" | "in-app" | "push";
  created_at: string;
  read: boolean;
}

interface Preferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  in_app: boolean;
}

export default function NotificationsPage() {
  const { tenant, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize WebSocket connection for real-time notifications
  useEffect(() => {
    if (!tenant?.id) return;
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/ws/notifications/${tenant.id}/`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("✅ WebSocket connected to Notification Service");
    ws.onmessage = (event) => {
      try {
        const notif = JSON.parse(event.data);
        toast.info(`${notif.title}: ${notif.message}`);
        setNotifications((prev) => [notif, ...prev]);
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };
    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("🔌 WebSocket closed");

    return () => ws.close();
  }, [tenant?.id]);

  const fetchNotifications = async () => {
    try {
      const [notifsRes, prefsRes] = await Promise.all([
        api.get("/api/v1/notifications", { params: { tenant_id: tenant?.id } }),
        api.get("/api/v1/notifications/preferences", { params: { tenant_id: tenant?.id } }),
      ]);
      setNotifications(notifsRes.data.data);
      setPrefs(prefsRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key: keyof Preferences, value: boolean) => {
    try {
      const updated = { ...prefs, [key]: value };
      setPrefs(updated as Preferences);
      await api.patch("/api/v1/notifications/preferences", {
        tenant_id: tenant?.id,
        preferences: updated,
      });
      toast.success("Notification preferences updated");
    } catch (err) {
      toast.error("Failed to update preferences");
    }
  };

  useEffect(() => {
    if (tenant?.id) fetchNotifications();
  }, [tenant?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="animate-spin text-gray-500" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ===== Notification Preferences ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {prefs && (
            <>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-500" /> Email
                </span>
                <Switch checked={prefs.email} onCheckedChange={(val) => updatePreference("email", val)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-green-500" /> SMS
                </span>
                <Switch checked={prefs.sms} onCheckedChange={(val) => updatePreference("sms", val)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-yellow-500" /> In-App
                </span>
                <Switch checked={prefs.in_app} onCheckedChange={(val) => updatePreference("in_app", val)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-purple-500" /> Push
                </span>
                <Switch checked={prefs.push} onCheckedChange={(val) => updatePreference("push", val)} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ===== Notification History ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((n) => (
                <TableRow key={n.id}>
                  <TableCell>
                    <Badge
                      className={
                        n.type === "order"
                          ? "bg-blue-100 text-blue-800"
                          : n.type === "payment"
                          ? "bg-green-100 text-green-800"
                          : n.type === "system"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-orange-100 text-orange-800"
                      }
                    >
                      {n.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{n.title}</TableCell>
                  <TableCell>{n.message}</TableCell>
                  <TableCell>{n.channel.toUpperCase()}</TableCell>
                  <TableCell>{new Date(n.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
