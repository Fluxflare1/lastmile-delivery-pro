"use client";
import { useNotificationContext } from "./NotificationProvider";

export const useNotification = () => {
  const { notify } = useNotificationContext();

  return {
    success: (msg: string, backendEvent?: any) =>
      notify("success", msg, false, backendEvent),
    error: (msg: string, backendEvent?: any) =>
      notify("error", msg, false, backendEvent),
    info: (msg: string, backendEvent?: any) =>
      notify("info", msg, false, backendEvent),
    warning: (msg: string, backendEvent?: any) =>
      notify("warning", msg, false, backendEvent),
  };
};
