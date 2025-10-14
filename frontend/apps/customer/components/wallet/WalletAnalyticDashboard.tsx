"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { walletApi } from "@/apps/customer/services/walletApi";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Loader2 } from "lucide-react";

const WalletAnalyticsDashboard = () => {
  const [range, setRange] = useState<{ startDate: Date; endDate: Date }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["walletAnalytics", range],
    queryFn: () =>
      walletApi.fetchAnalytics({
        start_date: range.startDate.toISOString().split("T")[0],
        end_date: range.endDate.toISOString().split("T")[0],
      }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-center text-red-600">Failed to load analytics data</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Wallet Analytics</h2>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600 text-3xl font-bold">₦{data.total_credits.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Debits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 text-3xl font-bold">₦{data.total_debits.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Balance Change</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-3xl font-bold ${
                data.net_change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ₦{data.net_change.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardTitle className="text-lg font-semibold mb-4">Credits vs Debits Over Time</CardTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.daily_trends}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="credits" fill="#16a34a" />
            <Bar dataKey="debits" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <CardTitle className="text-lg font-semibold mb-4">Balance Trend</CardTitle>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.balance_history}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="balance" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default WalletAnalyticsDashboard;
