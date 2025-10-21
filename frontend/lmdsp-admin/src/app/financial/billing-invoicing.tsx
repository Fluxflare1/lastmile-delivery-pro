'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Eye, Send, MoreHorizontal, FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Invoice {
  id: string
  customer: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  due_date: string
  issued_date: string
}

interface BillingInvoicingProps {
  invoices: Invoice[]
  overview: any
}

export default function BillingInvoicing({ invoices, overview }: BillingInvoicingProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const getStatusBadge = (status: string) => {
    const config = {
      paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800' }
    }[status] || { label: status, color: 'bg-gray-100 text-gray-800' }

    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'overdue':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const handleSendReminder = (invoiceId: string) => {
    // Implement send reminder functionality
    console.log('Sending reminder for invoice:', invoiceId)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Invoices */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>
                Manage and track your billing invoices
              </CardDescription>
            </div>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getStatusIcon(invoice.status)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{invoice.id}</div>
                    <div className="text-sm text-gray-500">{invoice.customer}</div>
                    <div className="text-xs text-gray-400">
                      Issued: {formatDate(invoice.issued_date)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Due: {formatDate(invoice.due_date)}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {getStatusBadge(invoice.status)}
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    {invoice.status !== 'paid' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSendReminder(invoice.id)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Summary</CardTitle>
          <CardDescription>
            Current billing status and metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Outstanding</span>
                <span className="font-semibold text-orange-600">
                  {formatCurrency(overview.outstanding_payments)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Paid This Month</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(overview.total_revenue - overview.outstanding_payments)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overdue Invoices</span>
                <span className="font-semibold text-red-600">
                  {invoices.filter(i => i.status === 'overdue').length}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Quick Actions</h4>
              <Button variant="outline" className="w-full justify-start">
                <Send className="h-4 w-4 mr-2" />
                Send Payment Reminders
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Billing Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Statements
              </Button>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="font-medium text-sm mb-3">Accepted Payment Methods</h4>
              <div className="flex space-x-2">
                <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">Bank Transfer</div>
                <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">Credit Card</div>
                <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">Flutterwave</div>
                <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">Paystack</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Statistics */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Invoice Statistics</CardTitle>
          <CardDescription>
            Monthly invoice performance and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{invoices.length}</div>
              <div className="text-sm text-gray-600">Total Invoices</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {invoices.filter(i => i.status === 'paid').length}
              </div>
              <div className="text-sm text-gray-600">Paid</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {invoices.filter(i => i.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {invoices.filter(i => i.status === 'overdue').length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
