'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const satisfactionData = [
  { month: 'Jan', score: 4.6, responses: 45 },
  { month: 'Feb', score: 4.7, responses: 52 },
  { month: 'Mar', score: 4.8, responses: 48 },
  { month: 'Apr', score: 4.9, responses: 61 },
  { month: 'May', score: 4.7, responses: 55 },
  { month: 'Jun', score: 4.8, responses: 58 }
]

const slaComplianceData = [
  { month: 'Jan', compliance: 92, target: 95 },
  { month: 'Feb', compliance: 94, target: 95 },
  { month: 'Mar', compliance: 96, target: 95 },
  { month: 'Apr', compliance: 95, target: 95 },
  { month: 'May', compliance: 97, target: 95 },
  { month: 'Jun', compliance: 96, target: 95 }
]

const issueResolutionData = [
  { category: 'Delivery Delay', count: 12, resolved: 10 },
  { category: 'Package Damage', count: 8, resolved: 7 },
  { category: 'Wrong Address', count: 5, resolved: 5 },
  { category: 'Courier Behavior', count: 3, resolved: 3 },
  { category: 'Payment Issues', count: 7, resolved: 6 }
]

export default function ServiceQualityMetrics() {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Customer Satisfaction Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Satisfaction Trend</CardTitle>
          <CardDescription>
            Monthly average satisfaction scores and response volume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={satisfactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" domain={[0, 5]} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="score" name="Satisfaction Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="responses" name="Survey Responses" stroke="#10b981" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* SLA Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>SLA Compliance Rate</CardTitle>
          <CardDescription>
            Service Level Agreement compliance vs target
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={slaComplianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[90, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="compliance" name="Actual Compliance" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Issue Resolution */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Issue Resolution Analysis</CardTitle>
          <CardDescription>
            Customer issues by category and resolution rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={issueResolutionData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="category" />
              <Tooltip />
              <Bar dataKey="count" name="Total Issues" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="resolved" name="Resolved Issues" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quality Metrics Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Quality Assurance Metrics</CardTitle>
          <CardDescription>
            Key performance indicators for service quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">4.8/5</div>
              <div className="text-sm text-gray-600">Avg Satisfaction</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">96.2%</div>
              <div className="text-sm text-gray-600">SLA Compliance</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <div className="text-sm text-gray-600">Issue Resolution</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">24h</div>
              <div className="text-sm text-gray-600">Avg Resolution Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
