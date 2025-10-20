"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Loader2, 
  CheckCircle, 
  Trash2,
  Settings,
  MessageSquare,
  AlertTriangle,
  Info
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "packages/shared/context/AuthContext";
import { format } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "payment" | "system" | "courier" | "alert";
  channel: "email" | "sms" | "in-app" | "push";
  created_at: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  in_app: boolean;
  order_updates: boolean;
  payment_alerts: boolean;
  system_maintenance: boolean;
  courier_updates: boolean;
}

interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  today: number;
}

export default function NotificationsPage() {
  const { tenant, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [markingRead, setMarkingRead] = useState<string | null>(null);

  // Initialize WebSocket connection for real-time notifications
  useEffect(() => {
    if (!tenant?.id) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "wss://api.lastmile-delivery-pro.com/ws"}/notifications/${tenant.id}/`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("✅ WebSocket connected to Notification Service");
    ws.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        
        // Show toast for new notifications
        toast.info(notification.title, {
          description: notification.message,
          duration: 5000,
        });

        // Add to notifications list
        setNotifications(prev => [notification, ...prev]);
        
        // Update stats
        setStats(prev => prev ? {
          ...prev,
          total: prev.total + 1,
          unread: prev.unread + 1,
          today: prev.today + 1
        } : null);

      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };
    
    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("🔌 WebSocket closed");

    return () => ws.close();
  }, [tenant?.id]);

  const fetchNotificationsData = async () => {
    try {
      const [notificationsRes, preferencesRes, statsRes] = await Promise.all([
        api.get("/api/v1/notifications", { 
          params: { 
            tenant_id: tenant?.id,
            limit: 100 
          } 
        }),
        api.get("/api/v1/notifications/preferences", { 
          params: { tenant_id: tenant?.id } 
        }),
        api.get("/api/v1/notifications/stats", { 
          params: { tenant_id: tenant?.id } 
        }),
      ]);
      
      setNotifications(notificationsRes.data.data);
      setPreferences(preferencesRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    try {
      const updatedPreferences = { ...preferences, [key]: value };
      setPreferences(updatedPreferences as NotificationPreferences);
      
      await api.patch("/api/v1/notifications/preferences", {
        tenant_id: tenant?.id,
        preferences: updatedPreferences,
      });
      
      toast.success("Notification preferences updated");
    } catch (err) {
      toast.error("Failed to update preferences");
      // Revert on error
      setPreferences(preferences);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setMarkingRead(notificationId);
      await api.patch(`/api/v1/notifications/${notificationId}/read`, {
        tenant_id: tenant?.id,
      });
      
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      
      // Update stats
      setStats(prev => prev ? {
        ...prev,
        unread: Math.max(0, prev.unread - 1),
        read: prev.read + 1
      } : null);
      
    } catch (err) {
      toast.error("Failed to mark as read");
    } finally {
      setMarkingRead(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/api/v1/notifications/mark-all-read", {
        tenant_id: tenant?.id,
      });
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      
      // Update stats
      setStats(prev => prev ? {
        ...prev,
        unread: 0,
        read: prev.total
      } : null);
      
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await api.delete(`/api/v1/notifications/${notificationId}`, {
        params: { tenant_id: tenant?.id }
      });
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Update stats
      setStats(prev => prev ? {
        ...prev,
        total: prev.total - 1,
        unread: prev.unread - (notifications.find(n => n.id === notificationId)?.read ? 0 : 1)
      } : null);
      
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order": return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "payment": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "system": return <Info className="h-4 w-4 text-gray-500" />;
      case "courier": return <Bell className="h-4 w-4 text-orange-500" />;
      case "alert": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  useEffect(() => {
    if (tenant?.id) fetchNotificationsData();
  }, [tenant?.id]);

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-500 h-8 w-8 mr-2" />
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== Stats Overview ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-red-600">{stats?.unread || 0}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <Bell className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold text-green-600">{stats?.read || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold">{stats?.today || 0}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Notifications List ===== */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={!notifications.some(n => !n.read)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="order">Orders</TabsTrigger>
                  <TabsTrigger value="payment">Payments</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No notifications found</p>
                        <p className="text-sm">You're all caught up!</p>
                      </div>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex justify-between items-start p-4 rounded-lg border ${
                            notification.read 
                              ? "bg-white" 
                              : "bg-blue-50 border-blue-200"
                          }`}
                        >
                          <div className="flex gap-3 flex-1">
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-semibold ${
                                  notification.read ? "text-gray-700" : "text-gray-900"
                                }`}>
                                  {notification.title}
                                </h4>
                                <Badge 
                                  variant="outline" 
                                  className={getPriorityColor(notification.priority)}
                                >
                                  {notification.priority}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>
                                  {format(new Date(notification.created_at), "PPpp")}
                                </span>
                                <Badge variant="secondary" className="capitalize">
                                  {notification.channel}
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className="capitalize"
                                >
                                  {notification.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsRead(notification.id)}
                                disabled={markingRead === notification.id}
                              >
                                {markingRead === notification.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* ===== Preferences Panel ===== */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Channel Preferences */}
              <div>
                <h4 className="font-medium mb-3">Delivery Channels</h4>
                <div className="space-y-4">
                  {preferences && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-500" />
                          Email Notifications
                        </span>
                        <Switch 
                          checked={preferences.email} 
                          onCheckedChange={(val) => updatePreference("email", val)} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-green-500" />
                          SMS Notifications
                        </span>
                        <Switch 
                          checked={preferences.sms} 
                          onCheckedChange={(val) => updatePreference("sms", val)} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-yellow-500" />
                          In-App Notifications
                        </span>
                        <Switch 
                          checked={preferences.in_app} 
                          onCheckedChange={(val) => updatePreference("in_app", val)} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-purple-500" />
                          Push Notifications
                        </span>
                        <Switch 
                          checked={preferences.push} 
                          onCheckedChange={(val) => updatePreference("push", val)} 
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Type Preferences */}
              <div>
                <h4 className="font-medium mb-3">Notification Types</h4>
                <div className="space-y-4">
                  {preferences && (
                    <>
                      <div className="flex items-center justify-between">
                        <span>Order Updates</span>
                        <Switch 
                          checked={preferences.order_updates} 
                          onCheckedChange={(val) => updatePreference("order_updates", val)} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Payment Alerts</span>
                        <Switch 
                          checked={preferences.payment_alerts} 
                          onCheckedChange={(val) => updatePreference("payment_alerts", val)} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>System Maintenance</span>
                        <Switch 
                          checked={preferences.system_maintenance} 
                          onCheckedChange={(val) => updatePreference("system_maintenance", val)} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Courier Updates</span>
                        <Switch 
                          checked={preferences.courier_updates} 
                          onCheckedChange={(val) => updatePreference("courier_updates", val)} 
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
