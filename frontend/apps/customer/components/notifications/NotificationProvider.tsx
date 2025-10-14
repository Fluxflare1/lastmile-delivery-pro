"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { NotificationToast } from "./NotificationToast";
import { triggerNotificationEvent } from "@/apps/customer/services/notificationApi";

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  persist?: boolean;
}

interface NotificationContextProps {
  notify: (
    type: Notification["type"],
    message: string,
    persist?: boolean,
    backendEvent?: {
      event_type: string;
      metadata?: Record<string, any>;
    }
  ) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const notify = useCallback(
    (
      type: Notification["type"],
      message: string,
      persist = false,
      backendEvent?
    ) => {
      const id = crypto.randomUUID();
      setNotifications((prev) => [...prev, { id, type, message, persist }]);

      // 🔗 Trigger backend notification for persistent alerts
      if (backendEvent) {
        triggerNotificationEvent({
          event_type: backendEvent.event_type,
          message,
          metadata: backendEvent.metadata,
        }).catch((err) => console.error("Backend notification failed:", err));
      }

      if (!persist) {
        setTimeout(() => remove(id), 4000);
      }
    },
    []
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notifications.map((n) => (
        <NotificationToast
          key={n.id}
          id={n.id}
          type={n.type}
          message={n.message}
          onClose={remove}
        />
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotificationContext must be used within NotificationProvider");
  return context;
};
