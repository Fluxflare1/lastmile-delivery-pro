"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle, RefreshCw, Truck, MapPin } from "lucide-react";
import { useAuth } from "packages/shared/context/AuthContext";
import { toast } from "sonner";
import OrderForm from "./components/OrderForm";
import CourierAssignModal from "./components/CourierAssignModal";

interface Order {
  id: string;
  reference: string;
  sender_name: string;
  recipient_name: string;
  status: string;
  courier_name?: string;
  origin: string;
  destination: string;
  created_at: string;
  updated_at: string;
}

export default function OrderManagementPage() {
  const { user, tenant } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [assignOrder, setAssignOrder] = useState<Order | null>(null);

  const canManage =
    user?.user_type === "Owner" || user?.user_type === "Manager" || user?.user_type === "Dispatcher";

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/v1/lmdsp/orders", {
        params: { tenant_id: tenant?.id },
      });
      setOrders(res.data.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // WebSocket for real-time updates
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL || "wss://api.lastmile-delivery-pro.com/ws/orders"}/?tenant=${tenant?.id}`
    );
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "order_update") {
        setOrders((prev) =>
          prev.map((o) => (o.id === msg.data.id ? { ...o, ...msg.data } : o))
        );
      }
      if (msg.type === "order_new") {
        setOrders((prev) => [msg.data, ...prev]);
      }
    };
    return () => ws.close();
  }, [tenant?.id]);

  const deleteOrder = async (id: string) => {
    try {
      await api.delete(`/api/v1/lmdsp/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.success("Order deleted successfully");
    } catch {
      toast.error("Failed to delete order");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Order Management</CardTitle>
          {canManage && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchOrders}>
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <PlusCircle className="h-4 w-4 mr-2" /> New Order
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { header: "Ref", accessorKey: "reference" },
              { header: "Sender", accessorKey: "sender_name" },
              { header: "Recipient", accessorKey: "recipient_name" },
              { header: "Status", accessorKey: "status" },
              { header: "Courier", accessorKey: "courier_name" },
              { header: "Origin", accessorKey: "origin" },
              { header: "Destination", accessorKey: "destination" },
              {
                header: "Actions",
                cell: ({ row }) =>
                  canManage && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setAssignOrder(row.original)}
                      >
                        <Truck className="h-4 w-4 mr-1" /> Assign
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteOrder(row.original.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ),
              },
            ]}
            data={orders}
            loading={loading}
          />
        </CardContent>
      </Card>

      {showForm && <OrderForm onClose={() => setShowForm(false)} onCreated={fetchOrders} />}
      {assignOrder && (
        <CourierAssignModal order={assignOrder} onClose={() => setAssignOrder(null)} onUpdated={fetchOrders} />
      )}
    </div>
  );
}
