
"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "@/lib/api";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "packages/shared/context/AuthContext";

interface OrderTracking {
  order_id: string;
  tracking_number: string;
  courier_name: string;
  status: string;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  current_location?: { lat: number; lng: number };
  eta?: string;
}

export default function TrackingPage() {
  const { tenant } = useAuth();
  const [orders, setOrders] = useState<OrderTracking[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<Record<string, any>>({});

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/v1/lmdsp/orders/tracking", {
        params: { tenant_id: tenant?.id },
      });
      setOrders(res.data.data);
    } catch {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL || "wss://api.lastmile-delivery-pro.com/ws/tracking"}?tenant=${tenant?.id}`
    );
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.event === "courier_location_update") {
        setLiveData((prev) => ({
          ...prev,
          [msg.data.order_id]: msg.data,
        }));
      }
    };
    return () => ws.close();
  }, [tenant?.id]);

  const selectedOrder = orders.find((o) => o.order_id === selected);
  const liveOrder = selected ? liveData[selected] : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Select
              value={selected || ""}
              onValueChange={setSelected}
              placeholder="Select Order"
              options={orders.map((o) => ({
                label: `${o.tracking_number} — ${o.courier_name}`,
                value: o.order_id,
              }))}
            />
          </div>

          <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-md">
            <MapContainer
              center={[6.5244, 3.3792]}
              zoom={12}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {selectedOrder && (
                <>
                  {/* Origin Marker */}
                  <Marker
                    position={[selectedOrder.origin.lat, selectedOrder.origin.lng]}
                    icon={L.icon({
                      iconUrl: "/icons/origin.png",
                      iconSize: [32, 32],
                    })}
                  >
                    <Popup>
                      <strong>Pickup:</strong> {selectedOrder.courier_name}
                    </Popup>
                  </Marker>

                  {/* Destination Marker */}
                  <Marker
                    position={[selectedOrder.destination.lat, selectedOrder.destination.lng]}
                    icon={L.icon({
                      iconUrl: "/icons/destination.png",
                      iconSize: [32, 32],
                    })}
                  >
                    <Popup>
                      <strong>Destination</strong>
                    </Popup>
                  </Marker>

                  {/* Courier Live Location */}
                  {liveOrder && (
                    <Marker
                      position={[
                        liveOrder.location.lat,
                        liveOrder.location.lng,
                      ]}
                      icon={L.icon({
                        iconUrl: "/icons/courier.png",
                        iconSize: [36, 36],
                      })}
                    >
                      <Popup>
                        <div>
                          <strong>{liveOrder.courier_name}</strong>
                          <p>Status: {liveOrder.status}</p>
                          <p>ETA: {liveOrder.eta}</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Route Line */}
                  <Polyline
                    positions={[
                      [selectedOrder.origin.lat, selectedOrder.origin.lng],
                      liveOrder
                        ? [liveOrder.location.lat, liveOrder.location.lng]
                        : [selectedOrder.destination.lat, selectedOrder.destination.lng],
                    ]}
                    color="blue"
                    dashArray="5,10"
                  />
                </>
              )}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
