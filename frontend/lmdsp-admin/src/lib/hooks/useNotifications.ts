"use client";
import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "packages/shared/context/AuthContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  created_at: string;
  read: boolean;
}

export function useNotifications() {
  const { tenant, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!tenant?.id || !user?.id) return;
    const socketUrl = `${process.env.NEXT_PUBLIC_WS_URL}/ws/notifications?tenant_id=${tenant.id}&user_id=${user.id}`;
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => console.log("🔌 Notifications WebSocket connected");
    ws.current.onmessage = (event) => {
      const notif = JSON.parse(event.data);
      setNotifications((prev) => [notif, ...prev]);
      toast.message(notif.title, { description: notif.message });
    };
    ws.current.onerror = (err) => console.error("WebSocket error", err);
    ws.current.onclose = () => console.log("Notifications WebSocket closed");

    return () => ws.current?.close();
  }, [tenant?.id, user?.id]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/api/v1/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return { notifications, markAsRead };
}
