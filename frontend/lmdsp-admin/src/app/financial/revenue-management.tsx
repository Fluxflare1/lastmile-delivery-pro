'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Download, TrendingUp, DollarSign, Package, Users } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface RevenueManagementProps {
  revenueBreakdown: {
    on_demand: number
    outstation: number
    subscription: number
  }
  overview: any
}

const monthlyRevenueData = [
  { month: 'Jan', revenue: 980000, orders: 850, growth: 12 },
  { month: 'Feb', revenue: 1120000, orders: 920, growth: 14 },
  { month: 'Mar', revenue: 1050000, orders: 880, growth: -6 },
  { month: 'Apr', revenue: 1240000, orders: 1050, growth: 18 },
  { month: 'May', revenue: 1180000, orders: 980, growth: -5 },
  { month: 'Jun', revenue: 1350000, orders: 1120, growth: 14 }
]

const customerRevenueData = [
  { segment: 'Regular Customers', revenue: 450000, customers: 45 },
  { segment: 'Premium Customers', revenue: 650000, customers: 25 },
  { segment: 'New Customers', revenue: 150000, customers: 30 }
]

const paymentMethodData = [
  { method: 'Bank Transfer', amount: 650000, percentage: 52 },
  { method: 'Credit Card', amount: 350000, percentage: 28 },
  { method: 'Flutterwave', amount: 150000, percentage: 12 },
  { method: 'Paystack', amount: 100000, percentage: 8 }
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function RevenueManagement({ revenueBreakdown, overview }: RevenueManagementProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Revenue') ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const serviceTypeData = [
    { name: 'On-Demand', value: revenueBreakdown.on_demand, color: '#3b82f6' },
    { name: 'Outstation', value: revenueBreakdown.outstation, color: '#10b981' },
    { name: 'Subscription', value: revenueBreakdown.subscription, color: '#f59e0b' }
  ]

  return (
    <div className="space-y-6">
      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(overview.total_revenue)}
                </div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  +{overview.revenue_trend}%
                </div>
                <div className="text-sm text-gray-600">Revenue Growth</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(overview.total_revenue / 6)}
                </div>
                <div className="text-sm text-gray-600">Avg Monthly Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>
              Revenue performance over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue (₦)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="growth" name="Growth %" stroke="#10b981" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Service Type */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service Type</CardTitle>
            <CardDescription>
              Breakdown of revenue across different services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Revenue Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Revenue Segments</CardTitle>
            <CardDescription>
              Revenue contribution by customer segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={customerRevenueData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="segment" />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="revenue" name="Revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Method Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Distribution</CardTitle>
            <CardDescription>
              Revenue distribution by payment methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethodData.map((item, index) => (
                <div key={item.method} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.method}</span>
                    <span>{formatCurrency(item.amount)} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Metrics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Performance Metrics</CardTitle>
          <CardDescription>
            Key revenue indicators and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(overview.total_revenue / 30)}
              </div>
              <div className="text-sm text-gray-600">Avg Daily Revenue</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(overview.total_revenue / monthlyRevenueData.reduce((acc, curr) => acc + curr.orders, 0))}
              </div>
              <div className="text-sm text-gray-600">Avg Order Value</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(overview.total_revenue / customerRevenueData.reduce((acc, curr) => acc + curr.customers, 0))}
              </div>
              <div className="text-sm text-gray-600">Revenue per Customer</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {overview.revenue_trend}%
              </div>
              <div className="text-sm text-gray-600">Growth Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
