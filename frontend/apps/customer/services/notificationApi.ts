import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lmdsp.com";

export const triggerNotificationEvent = async (payload: {
  event_type: string;
  message: string;
  metadata?: Record<string, any>;
}) => {
  const token = localStorage.getItem("auth_token");
  return axios.post(`${API_BASE}/api/notifications/trigger/`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
