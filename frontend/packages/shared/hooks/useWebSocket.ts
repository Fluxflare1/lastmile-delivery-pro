import { useEffect, useRef } from "react";

export const useWebSocket = (url: string, onMessage: (data: any) => void) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const ws = new WebSocket(`${url}?token=${token}`);
    socketRef.current = ws;

    ws.onmessage = e => onMessage(JSON.parse(e.data));
    ws.onclose = () => setTimeout(() => useWebSocket(url, onMessage), 5000); // reconnect
    return () => ws.close();
  }, [url]);
};
