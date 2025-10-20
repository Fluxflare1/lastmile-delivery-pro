"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Download,
  Wallet,
  TrendingUp,
  ArrowUpCircle,
  ArrowDownCircle,
  Loader2,
  FileText,
  Users,
  CreditCard,
  Calendar,
  Filter
} from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import api from "@/lib/api";
import { useAuth } from "packages/shared/context/AuthContext";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface WalletSummary {
  balance: number;
  available_balance: number;
  total_earnings: number;
  pending_payouts: number;
  this_month_revenue: number;
  last_month_revenue: number;
}

interface Transaction {
  id: string;
  reference: string;
  type: "credit" | "debit";
  amount: number;
  status: "success" | "pending" | "failed";
  created_at: string;
  description: string;
  metadata?: any;
}

interface Payout {
  id: string;
  reference: string;
  amount: number;
  status: "completed" | "processing" | "failed" | "pending";
  method: "bank_transfer" | "wallet" | "card";
  created_at: string;
  processed_at?: string;
  recipient: string;
  fee: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "draft";
  due_date: string;
  created_at: string;
  client_name: string;
  client_email: string;
  items: InvoiceItem[];
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export default function PaymentsPage() {
  const { tenant, user } = useAuth();
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("transactions");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 30);
    return { from, to };
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchPaymentsData = async () => {
    try {
      const [walletRes, txRes, payoutsRes, invoicesRes] = await Promise.all([
        api.get("/api/v1/payments/wallet", { params: { tenant_id: tenant?.id } }),
        api.get("/api/v1/payments/transactions", { 
          params: { 
            tenant_id: tenant?.id,
            start_date: dateRange.from.toISOString(),
            end_date: dateRange.to.toISOString(),
            status: statusFilter === "all" ? undefined : statusFilter
          } 
        }),
        api.get("/api/v1/payments/payouts", { params: { tenant_id: tenant?.id } }),
        api.get("/api/v1/payments/invoices", { params: { tenant_id: tenant?.id } }),
      ]);
      
      setWallet(walletRes.data.data);
      setTransactions(txRes.data.data);
      setPayouts(payoutsRes.data.data);
      setInvoices(invoicesRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: "csv" | "pdf") => {
    try {
      setExporting(true);
      const endpoint = activeTab === "transactions" ? "transactions" : 
                      activeTab === "payouts" ? "payouts" : "invoices";
      
      const res = await api.get(`/api/v1/payments/${endpoint}/export`, {
        params: {
          tenant_id: tenant?.id,
          format,
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString(),
        },
        responseType: "blob",
      });
      
      const blob = new Blob([res.data], {
        type: format === "csv" ? "text/csv" : "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${endpoint}_report_${Date.now()}.${format}`;
      a.click();
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handlePayout = async () => {
    try {
      const res = await api.post("/api/v1/payments/payouts", {
        tenant_id: tenant?.id,
        amount: wallet?.available_balance,
      });
      toast.success(`Payout initiated: ${res.data.data.reference}`);
      fetchPaymentsData(); // Refresh data
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Payout initiation failed");
    }
  };

  const handleGenerateInvoice = async () => {
    try {
      const res = await api.post("/api/v1/payments/invoices/generate", { 
        tenant_id: tenant?.id 
      });
      toast.success(`Invoice generated: ${res.data.data.invoice_number}`);
      fetchPaymentsData(); // Refresh data
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invoice generation failed");
    }
  };

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      await api.post(`/api/v1/payments/invoices/${invoiceId}/send`);
      toast.success("Invoice sent to client");
      fetchPaymentsData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send invoice");
    }
  };

  useEffect(() => {
    if (tenant?.id) fetchPaymentsData();
  }, [tenant?.id, dateRange, statusFilter]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const revenueChange = wallet ? 
    ((wallet.this_month_revenue - wallet.last_month_revenue) / wallet.last_month_revenue * 100) : 0;

  return (
    <div className="space-y-8">
      {/* ====== Wallet Summary ====== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <CardTitle className="text-gray-700 text-sm">Wallet Balance</CardTitle>
              <p className="text-2xl font-bold">
                ₦{wallet?.balance?.toLocaleString() ?? "0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Available for withdrawal</p>
            </div>
            <Wallet className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <CardTitle className="text-gray-700 text-sm">Available Balance</CardTitle>
              <p className="text-2xl font-bold">
                ₦{wallet?.available_balance?.toLocaleString() ?? "0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">After pending transactions</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <CardTitle className="text-gray-700 text-sm">Total Earnings</CardTitle>
              <p className="text-2xl font-bold">
                ₦{wallet?.total_earnings?.toLocaleString() ?? "0"}
              </p>
              <div className={`text-xs mt-1 ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueChange >= 0 ? '↑' : '↓'} {Math.abs(revenueChange).toFixed(1)}% from last month
              </div>
            </div>
            <ArrowUpCircle className="h-8 w-8 text-yellow-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <CardTitle className="text-gray-700 text-sm">Pending Payouts</CardTitle>
              <p className="text-2xl font-bold">
                ₦{wallet?.pending_payouts?.toLocaleString() ?? "0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">In processing</p>
            </div>
            <ArrowDownCircle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
      </div>

      {/* ====== Controls & Filters ====== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => handleExport("csv")}
            variant="outline"
            disabled={exporting}
            size="sm"
          >
            {exporting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
            Export CSV
          </Button>
          <Button
            onClick={() => handleExport("pdf")}
            variant="outline"
            disabled={exporting}
            size="sm"
          >
            {exporting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
            Export PDF
          </Button>
          
          {activeTab === "invoices" && (
            <Button onClick={handleGenerateInvoice} size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Generate Invoice
            </Button>
          )}
          
          {["Owner", "Manager"].includes(user?.user_type || "") && activeTab === "payouts" && (
            <Button onClick={handlePayout} variant="default" size="sm">
              <CreditCard className="h-4 w-4 mr-2" />
              Initiate Payout
            </Button>
          )}
        </div>
      </div>

      {/* ====== Tabs Content ====== */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="payouts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Payout History
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Invoices
          </TabsTrigger>
        </TabsList>

        {/* TRANSACTIONS TAB */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  {
                    accessorKey: "reference",
                    header: "Reference ID",
                    cell: ({ row }) => (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {row.original.reference}
                      </code>
                    ),
                  },
                  {
                    accessorKey: "type",
                    header: "Type",
                    cell: ({ row }) => (
                      <Badge
                        variant={row.original.type === "credit" ? "success" : "destructive"}
                        className="capitalize"
                      >
                        {row.original.type}
                      </Badge>
                    ),
                  },
                  {
                    accessorKey: "amount",
                    header: "Amount (₦)",
                    cell: ({ row }) => (
                      <span className={row.original.type === "credit" ? "text-green-600" : "text-red-600"}>
                        {row.original.type === "credit" ? "+" : "-"}₦{row.original.amount.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    accessorKey: "status",
                    header: "Status",
                    cell: ({ row }) => (
                      <Badge
                        variant={
                          row.original.status === "success"
                            ? "success"
                            : row.original.status === "pending"
                            ? "warning"
                            : "destructive"
                        }
                        className="capitalize"
                      >
                        {row.original.status}
                      </Badge>
                    ),
                  },
                  {
                    accessorKey: "created_at",
                    header: "Date",
                    cell: ({ row }) =>
                      format(new Date(row.original.created_at), "dd MMM yyyy, HH:mm"),
                  },
                  {
                    accessorKey: "description",
                    header: "Description",
                  },
                ]}
                data={transactions}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* PAYOUTS TAB */}
        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              {payouts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No payout history found</p>
                  <Button onClick={handlePayout} className="mt-4" variant="outline">
                    Initiate First Payout
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {payout.reference}
                          </code>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₦{payout.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-red-600">
                          -₦{payout.fee.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {payout.method.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payout.status === "completed"
                                ? "success"
                                : payout.status === "processing"
                                ? "warning"
                                : payout.status === "pending"
                                ? "outline"
                                : "destructive"
                            }
                            className="capitalize"
                          >
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{payout.recipient}</TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(payout.created_at), "dd MMM yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* INVOICES TAB */}
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No invoices found</p>
                  <Button onClick={handleGenerateInvoice} className="mt-4" variant="outline">
                    Generate First Invoice
                  </Button>
                </div>
              ) : (
                <DataTable
                  columns={[
                    {
                      accessorKey: "invoice_number",
                      header: "Invoice #",
                      cell: ({ row }) => (
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {row.original.invoice_number}
                        </code>
                      ),
                    },
                    {
                      accessorKey: "client_name",
                      header: "Client",
                    },
                    {
                      accessorKey: "amount",
                      header: "Amount (₦)",
                      cell: ({ row }) => `₦${row.original.amount.toLocaleString()}`,
                    },
                    {
                      accessorKey: "status",
                      header: "Status",
                      cell: ({ row }) => (
                        <Badge
                          variant={
                            row.original.status === "paid"
                              ? "success"
                              : row.original.status === "pending"
                              ? "warning"
                              : row.original.status === "overdue"
                              ? "destructive"
                              : "outline"
                          }
                          className="capitalize"
                        >
                          {row.original.status}
                        </Badge>
                      ),
                    },
                    {
                      accessorKey: "due_date",
                      header: "Due Date",
                      cell: ({ row }) => (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {format(new Date(row.original.due_date), "dd MMM yyyy")}
                        </div>
                      ),
                    },
                    {
                      accessorKey: "created_at",
                      header: "Created",
                      cell: ({ row }) =>
                        format(new Date(row.original.created_at), "dd MMM yyyy"),
                    },
                    {
                      id: "actions",
                      header: "Actions",
                      cell: ({ row }) => (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendInvoice(row.original.id)}
                            disabled={row.original.status === "paid"}
                          >
                            Send
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  data={invoices}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
