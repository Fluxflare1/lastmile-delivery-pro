"use client";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

export function NotificationList() {
  const { notifications, markAsRead } = useNotifications();

  return (
    <ScrollArea className="h-96">
      <div className="divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No new notifications</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 hover:bg-gray-50 ${
                notif.read ? "opacity-60" : "opacity-100"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{notif.title}</p>
                  <p className="text-sm text-gray-600">{notif.message}</p>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(notif.created_at))} ago
                  </span>
                </div>
                {!notif.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markAsRead(notif.id)}
                  >
                    Mark read
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
