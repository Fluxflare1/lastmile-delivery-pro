"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Download, BarChart3, Truck, DollarSign, Users } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart } from "recharts";
import api from "@/lib/api";
import { useAuth } from "packages/shared/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface KPIs {
  total_orders: number;
  completed_deliveries: number;
  total_revenue: number;
  active_couriers: number;
}

interface ChartData {
  date: string;
  orders: number;
  deliveries: number;
  revenue: number;
}

export default function AnalyticsPage() {
  const { tenant, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 30);
    return { from, to };
  });

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/api/v1/analytics/overview", {
        params: {
          tenant_id: tenant?.id,
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString(),
        },
      });
      setKpis(res.data.data.kpis);
      setChartData(res.data.data.trends);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: "csv" | "pdf") => {
    try {
      const res = await api.get(`/api/v1/analytics/export`, {
        params: {
          tenant_id: tenant?.id,
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString(),
          format,
        },
        responseType: "blob",
      });
      const blob = new Blob([res.data], {
        type: format === "csv" ? "text/csv" : "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics_report_${Date.now()}.${format}`;
      a.click();
      toast.success(`Analytics exported as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error("Export failed");
    }
  };

  useEffect(() => {
    if (tenant?.id) fetchAnalytics();
  }, [tenant?.id, dateRange]);

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6 p-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ====== KPIs ====== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <CardTitle className="text-gray-700">Total Orders</CardTitle>
              <p className="text-2xl font-bold">{kpis?.total_orders ?? 0}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <CardTitle className="text-gray-700">Completed Deliveries</CardTitle>
              <p className="text-2xl font-bold">{kpis?.completed_deliveries ?? 0}</p>
            </div>
            <Truck className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <CardTitle className="text-gray-700">Total Revenue</CardTitle>
              <p className="text-2xl font-bold">
                ₦{kpis?.total_revenue?.toLocaleString() ?? "0"}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <CardTitle className="text-gray-700">Active Couriers</CardTitle>
              <p className="text-2xl font-bold">{kpis?.active_couriers ?? 0}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      {/* ====== Date Filter & Export ====== */}
      <div className="flex justify-between items-center">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <div className="flex gap-2">
          <Button onClick={() => handleExport("csv")} variant="outline">
            Export CSV
          </Button>
          <Button onClick={() => handleExport("pdf")} variant="default">
            Export PDF
          </Button>
        </div>
      </div>

      {/* ====== Charts ====== */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#3b82f6" name="Orders" />
              <Line type="monotone" dataKey="deliveries" stroke="#10b981" name="Deliveries" />
              <Line type="monotone" dataKey="revenue" stroke="#f59e0b" name="Revenue (₦)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ====== Top Couriers ====== */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Couriers</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="deliveries" fill="#10b981" name="Deliveries" />
              <Bar dataKey="revenue" fill="#f59e0b" name="Revenue (₦)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
