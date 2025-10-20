"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Package, Truck, Users, BarChart3 } from "lucide-react";
import { useAuth } from "packages/shared/context/AuthContext";

interface AnalyticsData {
  total_orders: number;
  active_couriers: number;
  total_customers: number;
  revenue: number;
  daily_orders: { date: string; count: number }[];
}

export default function DashboardPage() {
  const { tenant } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get(`/api/v1/analytics/dashboard`, {
        params: { tenant_id: tenant?.id },
      });
      setData(res.data.data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Real-time updates via WebSocket
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL || "wss://api.lastmile-delivery-pro.com/ws/analytics"}/?tenant=${tenant?.id}`
    );
    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === "analytics_update") {
        setData((prev) => ({ ...prev!, ...payload.data }));
      }
    };
    ws.onerror = (e) => console.error("WebSocket error:", e);
    return () => ws.close();
  }, [tenant?.id]);

  if (loading || !data) return <div className="p-6">Loading analytics...</div>;

  const kpiCards = [
    { title: "Total Orders", value: data.total_orders, icon: Package, color: "bg-blue-100 text-blue-700" },
    { title: "Active Couriers", value: data.active_couriers, icon: Truck, color: "bg-green-100 text-green-700" },
    { title: "Total Customers", value: data.total_customers, icon: Users, color: "bg-yellow-100 text-yellow-700" },
    { title: "Revenue", value: `$${data.revenue.toLocaleString()}`, icon: BarChart3, color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className="shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Orders Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.daily_orders}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
