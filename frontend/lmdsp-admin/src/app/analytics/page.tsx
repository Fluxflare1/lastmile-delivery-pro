"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "packages/shared/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsData {
  total_orders: number;
  delivered_today: number;
  active_couriers: number;
  average_delivery_time: number;
  revenue_today: number;
  top_zones: { zone: string; orders: number }[];
  monthly_trends: { month: string; delivered: number; failed: number }[];
  courier_performance: { name: string; completed: number; on_time_rate: number }[];
  delivery_distribution: { status: string; count: number }[];
}

export default function AnalyticsPage() {
  const { tenant } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/api/v1/analytics/overview", {
        params: { tenant_id: tenant?.id },
      });
      setData(res.data.data);
    } catch {
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, [tenant?.id]);

  if (loading || !data)
    return (
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    );

  const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

  return (
    <div className="space-y-8">
      {/* ===== Top KPI Cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{data.total_orders}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivered Today</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">
            {data.delivered_today}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Couriers</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-blue-600">
            {data.active_couriers}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg. Delivery Time</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-yellow-600">
            {data.average_delivery_time} min
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Today</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-emerald-600">
            ${data.revenue_today.toLocaleString()}
          </CardContent>
        </Card>
      </div>

      {/* ===== Monthly Trends ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Delivery Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthly_trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="failed" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ===== Courier Performance ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Courier Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.courier_performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#3B82F6" />
              <Bar dataKey="on_time_rate" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ===== Delivery Distribution ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] flex justify-center items-center">
          <ResponsiveContainer width="60%" height="100%">
            <PieChart>
              <Pie
                data={data.delivery_distribution}
                dataKey="count"
                nameKey="status"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {data.delivery_distribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ===== Top Zones ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200">
            {data.top_zones.map((zone, i) => (
              <li key={i} className="flex justify-between py-2">
                <span className="font-medium">{zone.zone}</span>
                <span className="text-blue-600 font-semibold">{zone.orders}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
