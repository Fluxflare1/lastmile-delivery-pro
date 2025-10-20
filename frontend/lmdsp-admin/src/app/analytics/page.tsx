// frontend/lmdsp-admin/src/app/analytics/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Loader2 } from "lucide-react";

// Combined interfaces from both codes
interface AnalyticsData {
  // From Code 1
  total_orders: number;
  delivered_today: number;
  active_couriers: number;
  average_delivery_time: number;
  revenue_today: number;
  top_zones: { zone: string; orders: number }[];
  monthly_trends: { month: string; delivered: number; failed: number }[];
  courier_performance: { name: string; completed: number; on_time_rate: number }[];
  delivery_distribution: { status: string; count: number }[];
  
  // From Code 2
  completed_orders: number;
  total_revenue: number;
  on_time_rate: number;
  revenue_trends: { date: string; revenue: number }[];
  detailed_courier_performance: { 
    courier_id: string; 
    courier_name: string; 
    deliveries: number; 
    avg_rating: number; 
    on_time_percentage: number 
  }[];
}

export default function AnalyticsPage() {
  const { tenant } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchAnalytics = async () => {
    try {
      const [overviewRes, performanceRes] = await Promise.all([
        api.get("/api/v1/analytics/overview", { params: { tenant_id: tenant?.id } }),
        api.get("/api/v1/analytics/performance", { params: { tenant_id: tenant?.id } })
      ]);

      // Merge data from both endpoints
      setData({
        ...overviewRes.data.data,
        ...performanceRes.data.data
      });
    } catch {
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [tenant?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-8 w-8 mr-2" />
        Loading analytics...
      </div>
    );
  }

  if (!data) return <div className="text-center mt-10">No analytics data available</div>;

  const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Business Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="zones">Zone Analytics</TabsTrigger>
        </TabsList>

        {/* TAB 1: Business Overview (from Code 1) */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.total_orders}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Delivered Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{data.delivered_today}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Active Couriers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{data.active_couriers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avg Delivery Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{data.average_delivery_time}m</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Revenue Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  ${data.revenue_today?.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
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

            <Card>
              <CardHeader>
                <CardTitle>Delivery Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.delivery_distribution}
                      dataKey="count"
                      nameKey="status"
                      outerRadius={80}
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
          </div>
        </TabsContent>

        {/* TAB 2: Performance Analytics (from Code 2) */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Completed Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{data.completed_orders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${data.total_revenue?.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">On-Time Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {data.on_time_rate?.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.revenue_trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Courier Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.detailed_courier_performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="courier_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="deliveries" fill="#22c55e" name="Deliveries" />
                    <Bar dataKey="avg_rating" fill="#3b82f6" name="Avg Rating" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: Zone Analytics (from Code 1) */}
        <TabsContent value="zones">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.top_zones.map((zone, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">{zone.zone}</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                      {zone.orders} orders
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
