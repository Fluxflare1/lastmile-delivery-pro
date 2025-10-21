'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

interface PerformanceChartsProps {
  data: any
}

const orderStatusData = [
  { name: 'Completed', value: 65, color: '#10b981' },
  { name: 'In Transit', value: 20, color: '#f59e0b' },
  { name: 'Pending', value: 10, color: '#3b82f6' },
  { name: 'Cancelled', value: 5, color: '#ef4444' }
]

const revenueData = [
  { month: 'Jan', revenue: 450000, deliveries: 420 },
  { month: 'Feb', revenue: 520000, deliveries: 480 },
  { month: 'Mar', revenue: 480000, deliveries: 450 },
  { month: 'Apr', revenue: 610000, deliveries: 520 },
  { month: 'May', revenue: 580000, deliveries: 490 },
  { month: 'Jun', revenue: 720000, deliveries: 580 }
]

const performanceData = [
  { metric: 'On-Time Delivery', score: 94, target: 95 },
  { metric: 'Customer Satisfaction', score: 4.7, target: 4.8 },
  { metric: 'First Attempt Success', score: 96, target: 97 },
  { metric: 'Response Time', score: 92, target: 90 }
]

export default function PerformanceCharts({ data }: PerformanceChartsProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Revenue') ? `₦${entry.value.toLocaleString()}` : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Delivery Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue (₦)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="deliveries" name="Deliveries" stroke="#10b981" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Order Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Performance Metrics vs Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={performanceData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="metric" />
              <Tooltip />
              <Bar dataKey="score" name="Actual Score" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="target" name="Target" fill="#94a3b8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Metrics Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">94.2%</div>
              <div className="text-sm text-gray-600">On-Time Delivery</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">4.7/5</div>
              <div className="text-sm text-gray-600">Customer Rating</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">96.8%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2.3h</div>
              <div className="text-sm text-gray-600">Avg Delivery Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
