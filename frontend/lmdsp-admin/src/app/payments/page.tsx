"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, FileText, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "packages/shared/context/AuthContext";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface RevenueSummary {
  total_revenue: number;
  courier_payouts: number;
  pending_payouts: number;
  client_invoices: number;
}

interface Transaction {
  id: string;
  date: string;
  type: "credit" | "debit";
  description: string;
  amount: number;
  status: "completed" | "pending" | "failed";
}

interface RevenueTrend {
  date: string;
  revenue: number;
}

export default function PaymentsDashboard() {
  const { tenant, user } = useAuth();
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrend[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPaymentsData = async () => {
    try {
      const [summaryRes, txRes, trendRes] = await Promise.all([
        api.get("/api/v1/payments/summary", { params: { tenant_id: tenant?.id } }),
        api.get("/api/v1/payments/transactions", { params: { tenant_id: tenant?.id } }),
        api.get("/api/v1/payments/revenue-trend", { params: { tenant_id: tenant?.id } }),
      ]);

      setSummary(summaryRes.data.data);
      setTransactions(txRes.data.data);
      setRevenueTrend(trendRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenant?.id) fetchPaymentsData();
  }, [tenant?.id]);

  const handleGenerateInvoice = async () => {
    try {
      const res = await api.post("/api/v1/payments/invoices/generate", { tenant_id: tenant?.id });
      toast.success(`Invoice generated successfully: ${res.data.data.invoice_number}`);
    } catch (err) {
      toast.error("Failed to generate invoice");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="animate-spin text-gray-500" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ₦{summary?.total_revenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Courier Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-600">
              ₦{summary?.courier_payouts.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-yellow-600">
              ₦{summary?.pending_payouts.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-purple-600">
              ₦{summary?.client_invoices.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ===== REVENUE TREND ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ===== TABS ===== */}
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        {/* TRANSACTIONS TAB */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Recent Transactions</CardTitle>
              <Button onClick={handleGenerateInvoice}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Invoice
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {tx.type === "credit" ? (
                          <ArrowUpCircle className="text-green-500 w-4 h-4" />
                        ) : (
                          <ArrowDownCircle className="text-red-500 w-4 h-4" />
                        )}
                        {tx.description}
                      </TableCell>
                      <TableCell>
                        ₦{tx.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            tx.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : tx.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
