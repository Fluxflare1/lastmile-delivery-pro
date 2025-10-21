'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Download, TrendingDown, AlertTriangle, DollarSign, Fuel, Wrench, Users, Megaphone } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface CostAnalysisProps {
  expenseCategories: {
    courier_payouts: number
    fuel: number
    maintenance: number
    salaries: number
    marketing: number
    overhead: number
  }
  overview: any
}

const monthlyExpenseData = [
  { month: 'Jan', total: 820000, courier_payouts: 420000, fuel: 110000, trend: 8 },
  { month: 'Feb', total: 780000, courier_payouts: 400000, fuel: 105000, trend: -5 },
  { month: 'Mar', total: 850000, courier_payouts: 430000, fuel: 115000, trend: 9 },
  { month: 'Apr', total: 920000, courier_payouts: 470000, fuel: 125000, trend: 8 },
  { month: 'May', total: 890000, courier_payouts: 450000, fuel: 120000, trend: -3 },
  { month: 'Jun', total: 950000, courier_payouts: 480000, fuel: 130000, trend: 7 }
]

const costPerDeliveryData = [
  { month: 'Jan', cost: 245, revenue: 320, margin: 75 },
  { month: 'Feb', cost: 238, revenue: 315, margin: 77 },
  { month: 'Mar', cost: 252, revenue: 318, margin: 66 },
  { month: 'Apr', cost: 248, revenue: 325, margin: 77 },
  { month: 'May', cost: 255, revenue: 322, margin: 67 },
  { month: 'Jun', cost: 242, revenue: 330, margin: 88 }
]

const expenseEfficiencyData = [
  { category: 'Courier Payouts', budget: 500000, actual: 480000, efficiency: 96 },
  { category: 'Fuel', budget: 150000, actual: 130000, efficiency: 87 },
  { category: 'Maintenance', budget: 90000, actual: 80000, efficiency: 89 },
  { category: 'Marketing', budget: 60000, actual: 50000, efficiency: 83 },
  { category: 'Overhead', budget: 50000, actual: 40000, efficiency: 80 }
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function CostAnalysis({ expenseCategories, overview }: CostAnalysisProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Cost') || entry.name.includes('Revenue') || entry.name.includes('Margin') ? 
                `₦${entry.value}` : 
                entry.name.includes('Efficiency') ? `${entry.value}%` : 
                formatCurrency(entry.value)
              }
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const expenseData = Object.entries(expenseCategories).map(([key, value], index) => ({
    name: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: value,
    color: COLORS[index % COLORS.length]
  }))

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'courier payouts':
        return <Users className="h-4 w-4" />
      case 'fuel':
        return <Fuel className="h-4 w-4" />
      case 'maintenance':
        return <Wrench className="h-4 w-4" />
      case 'salaries':
        return <DollarSign className="h-4 w-4" />
      case 'marketing':
        return <Megaphone className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Cost Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-4">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(overview.total_expenses)}
                </div>
                <div className="text-sm text-gray-600">Total Expenses</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <TrendingDown className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {overview.expense_trend}%
                </div>
                <div className="text-sm text-gray-600">Expense Growth</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <AlertTriangle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(overview.total_expenses / 6)}
                </div>
                <div className="text-sm text-gray-600">Avg Monthly Cost</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Expense Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
            <CardDescription>
              Expense tracking over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Total Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="courier_payouts" name="Courier Payouts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="trend" name="Trend %" stroke="#f59e0b" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>
              Breakdown of costs by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost per Delivery Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Cost per Delivery Analysis</CardTitle>
            <CardDescription>
              Delivery cost efficiency and margins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costPerDeliveryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost" name="Cost per Delivery (₦)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" name="Revenue per Delivery (₦)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="margin" name="Margin per Delivery (₦)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Efficiency</CardTitle>
            <CardDescription>
              Budget vs actual spending efficiency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseEfficiencyData.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(item.category)}
                      <span className="text-sm font-medium">{item.category}</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      item.efficiency >= 90 ? 'text-green-600' :
                      item.efficiency >= 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {item.efficiency}% efficiency
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Budget: {formatCurrency(item.budget)}</span>
                    <span>Actual: {formatCurrency(item.actual)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.efficiency >= 90 ? 'bg-green-500' :
                        item.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.efficiency}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Optimization Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Optimization Opportunities</CardTitle>
          <CardDescription>
            Potential areas for cost reduction and efficiency improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Fuel className="h-5 w-5 text-orange-500" />
                <h4 className="font-medium">Fuel Efficiency</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Optimize delivery routes to reduce fuel consumption by 15%
              </p>
              <div className="text-xs text-blue-600 font-medium">Potential Savings: ₦180,000/month</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Wrench className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium">Preventive Maintenance</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Implement scheduled maintenance to reduce breakdown costs
              </p>
              <div className="text-xs text-blue-600 font-medium">Potential Savings: ₦45,000/month</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-green-500" />
                <h4 className="font-medium">Courier Efficiency</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Optimize assignment algorithms to reduce idle time
              </p>
              <div className="text-xs text-blue-600 font-medium">Potential Savings: ₦75,000/month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
