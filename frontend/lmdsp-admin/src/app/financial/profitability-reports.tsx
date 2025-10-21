'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts'
import { Download, TrendingUp, DollarSign, PieChart, BarChart3 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ProfitabilityReportsProps {
  overview: any
  revenueBreakdown: any
  expenseCategories: any
}

const profitabilityData = [
  { month: 'Jan', revenue: 980000, expenses: 820000, profit: 160000, margin: 16.3 },
  { month: 'Feb', revenue: 1120000, expenses: 780000, profit: 340000, margin: 30.4 },
  { month: 'Mar', revenue: 1050000, expenses: 850000, profit: 200000, margin: 19.0 },
  { month: 'Apr', revenue: 1240000, expenses: 920000, profit: 320000, margin: 25.8 },
  { month: 'May', revenue: 1180000, expenses: 890000, profit: 290000, margin: 24.6 },
  { month: 'Jun', revenue: 1350000, expenses: 950000, profit: 400000, margin: 29.6 }
]

const serviceProfitability = [
  { service: 'On-Demand', revenue: 650000, cost: 520000, profit: 130000, margin: 20.0 },
  { service: 'Outstation', revenue: 450000, cost: 315000, profit: 135000, margin: 30.0 },
  { service: 'Subscription', revenue: 150000, cost: 55000, profit: 95000, margin: 63.3 }
]

const customerProfitability = [
  { segment: 'Premium', customers: 25, revenue: 650000, profit: 195000, margin: 30.0 },
  { segment: 'Regular', customers: 45, revenue: 450000, profit: 90000, margin: 20.0 },
  { segment: 'New', customers: 30, revenue: 150000, profit: 30000, margin: 20.0 }
]

const roiAnalysis = [
  { investment: 'Fleet Expansion', amount: 500000, returns: 750000, roi: 50, period: '12 months' },
  { investment: 'Technology Upgrade', amount: 200000, returns: 350000, roi: 75, period: '18 months' },
  { investment: 'Marketing Campaign', amount: 150000, returns: 220000, roi: 47, period: '6 months' },
  { investment: 'Courier Training', amount: 80000, returns: 120000, roi: 50, period: '9 months' }
]

export default function ProfitabilityReports({ overview, revenueBreakdown, expenseCategories }: ProfitabilityReportsProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Margin') ? `${entry.value}%` : formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Profitability Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(overview.net_profit)}
                </div>
                <div className="text-sm text-gray-600">Net Profit</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {overview.profit_trend}%
                </div>
                <div className="text-sm text-gray-600">Profit Growth</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {((overview.net_profit / overview.total_revenue) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Net Profit Margin</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profitability Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Profitability Trend</CardTitle>
            <CardDescription>
              Monthly profit performance and margins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={profitabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="profit" name="Net Profit" fill="#10b981" stroke="#10b981" />
                <Line type="monotone" dataKey="margin" name="Margin %" stroke="#3b82f6" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Line Profitability */}
        <Card>
          <CardHeader>
            <CardTitle>Service Line Profitability</CardTitle>
            <CardDescription>
              Profit margins by service type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceProfitability}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Segment Profitability */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segment Profitability</CardTitle>
            <CardDescription>
              Profit contribution by customer segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerProfitability.map((segment) => (
                <div key={segment.segment} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{segment.segment} Customers</span>
                    <span className="text-sm text-gray-500">{segment.customers} customers</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Revenue: {formatCurrency(segment.revenue)}</span>
                    <span>Profit: {formatCurrency(segment.profit)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${segment.margin}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Margin: {segment.margin}%</span>
                    <span>Profit per Customer: {formatCurrency(segment.profit / segment.customers)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ROI Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Return on Investment Analysis</CardTitle>
            <CardDescription>
              Performance of recent investments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roiAnalysis.map((investment, index) => (
                <div key={investment.investment} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{investment.investment}</div>
                      <div className="text-sm text-gray-500">Period: {investment.period}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      investment.roi >= 50 ? 'bg-green-100 text-green-800' :
                      investment.roi >= 30 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      ROI: {investment.roi}%
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-gray-600">Investment</div>
                      <div className="font-medium">{formatCurrency(investment.amount)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Returns</div>
                      <div className="font-medium text-green-600">{formatCurrency(investment.returns)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profitability Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Profitability Metrics</CardTitle>
          <CardDescription>
            Key profitability indicators and performance benchmarks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {((overview.net_profit / overview.total_revenue) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Net Profit Margin</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(overview.net_profit / 6)}
              </div>
              <div className="text-sm text-gray-600">Avg Monthly Profit</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {overview.profit_trend}%
              </div>
              <div className="text-sm text-gray-600">Profit Growth Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(overview.net_profit / customerProfitability.reduce((acc: number, curr: any) => acc + curr.customers, 0))}
              </div>
              <div className="text-sm text-gray-600">Profit per Customer</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Break-even Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Break-even Analysis</CardTitle>
          <CardDescription>
            Current break-even point and margin of safety
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Break-even Point</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {Math.round(overview.total_expenses / (overview.total_revenue / 850))}
                  </div>
                  <div className="text-sm text-gray-600">Deliveries/Month</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(overview.total_expenses)}
                  </div>
                  <div className="text-sm text-gray-600">Revenue/Month</div>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Current Performance:</strong> Operating at{' '}
                  {Math.round((overview.total_revenue / overview.total_expenses) * 100)}% of break-even capacity
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Margin of Safety</h4>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(((overview.total_revenue - overview.total_expenses) / overview.total_revenue) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Safety Margin</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-800">
                  <strong>Healthy Position:</strong> Revenue can decline by{' '}
                  {Math.round(((overview.total_revenue - overview.total_expenses) / overview.total_revenue) * 100)}% before reaching break-even
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
