"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "packages/shared/context/AuthContext";
import { courierTrackingSocket } from "@/lib/ws";
import { CourierUpdateEvent } from "@/types/realtime";

const Map = dynamic(() => import("@react-google-maps/api").then((mod) => mod.GoogleMap), { ssr: false });
const Marker = dynamic(() => import("@react-google-maps/api").then((mod) => mod.Marker), { ssr: false });

interface Courier {
  id: string;
  name: string;
  lat: number;
  lng: number;
  active: boolean;
  performance_score: number;
}

interface Order {
  id: string;
  customer_name: string;
  lat: number;
  lng: number;
  status: string;
  courier_id?: string;
}

export default function RealTimeTrackingPage() {
  const { tenant, user } = useAuth();
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  const fetchTrackingData = async () => {
    try {
      const [courierRes, orderRes] = await Promise.all([
        api.get("/api/v1/tracking/couriers", { params: { tenant_id: tenant?.id } }),
        api.get("/api/v1/tracking/orders", { params: { tenant_id: tenant?.id } }),
      ]);
      setCouriers(courierRes.data.data);
      setOrders(orderRes.data.data);
    } catch {
      toast.error("Failed to fetch live tracking data");
    }
  };

  useEffect(() => {
    if (!tenant?.id) return;

    fetchTrackingData();
    const token = localStorage.getItem("access_token")!;
    const ws = courierTrackingSocket(token);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg: CourierUpdateEvent = JSON.parse(event.data);
        if (msg.event === "courier_update") {
          setCouriers((prev) =>
            prev.map((c) =>
              c.id === msg.data.courier_id
                ? { ...c, performance_score: msg.data.performance_score, active: msg.data.active }
                : c
            )
          );
        }
      } catch {
        console.warn("Invalid WebSocket message received");
      }
    };

    ws.onerror = () => toast.error("WebSocket connection error");
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [tenant?.id]);

  return (
    <div className="space-y-8">
      {/* ======= MAP VIEW ======= */}
      <Card>
        <CardHeader>
          <CardTitle>Live Courier & Order Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] w-full rounded-lg overflow-hidden">
            <Map
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={{ lat: 6.5244, lng: 3.3792 }} // Lagos default
              zoom={12}
            >
              {couriers.map((courier) => (
                <Marker
                  key={courier.id}
                  position={{ lat: courier.lat, lng: courier.lng }}
                  label={courier.name}
                  icon={{
                    url: courier.active
                      ? "/icons/courier-active.png"
                      : "/icons/courier-inactive.png",
                    scaledSize: new google.maps.Size(40, 40),
                  }}
                />
              ))}

              {orders.map((order) => (
                <Marker
                  key={order.id}
                  position={{ lat: order.lat, lng: order.lng }}
                  label={order.customer_name}
                  icon={{
                    url:
                      order.status === "delivered"
                        ? "/icons/order-delivered.png"
                        : "/icons/order-pending.png",
                    scaledSize: new google.maps.Size(36, 36),
                  }}
                />
              ))}
            </Map>
          </div>
        </CardContent>
      </Card>

      {/* ======= STATS OVERVIEW ======= */}
      <Card>
        <CardHeader>
          <CardTitle>Live Stats Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Couriers</CardTitle>
            </CardHeader>
            <CardContent>{couriers.length}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Couriers</CardTitle>
            </CardHeader>
            <CardContent>
              {couriers.filter((c) => c.active).length}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ongoing Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.filter((o) => o.status !== "delivered").length}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
