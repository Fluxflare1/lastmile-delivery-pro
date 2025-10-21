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
      // Mock data for now - replace with actual API call
      const mockData: AnalyticsData = {
        total_orders: 1247,
        active_couriers: 42,
        total_customers: 856,
        revenue: 2400000,
        daily_orders: [
          { date: "Mon", count: 120 },
          { date: "Tue", count: 190 },
          { date: "Wed", count: 150 },
          { date: "Thu", count: 210 },
          { date: "Fri", count: 180 },
          { date: "Sat", count: 240 },
          { date: "Sun", count: 170 },
        ]
      };
      setData(mockData);
      
      // Uncomment when API is ready:
      // const res = await api.get(`/api/v1/analytics/dashboard`, {
      //   params: { tenant_id: tenant?.id },
      // });
      // setData(res.data.data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tenant?.id]);

  if (loading || !data) return <div className="p-6">Loading analytics...</div>;

  const kpiCards = [
    { title: "Total Orders", value: data.total_orders, icon: Package, color: "bg-blue-100 text-blue-700" },
    { title: "Active Couriers", value: data.active_couriers, icon: Truck, color: "bg-green-100 text-green-700" },
    { title: "Total Customers", value: data.total_customers, icon: Users, color: "bg-yellow-100 text-yellow-700" },
    { title: "Revenue", value: `₦${(data.revenue / 100).toLocaleString()}`, icon: BarChart3, color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className="shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
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
