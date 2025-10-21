'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, CreditCard, BarChart3, Wallet } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface FinancialOverviewProps {
  data: {
    total_revenue: number
    revenue_trend: number
    total_expenses: number
    expense_trend: number
    net_profit: number
    profit_trend: number
    outstanding_payments: number
    cash_flow: string
  }
}

export default function FinancialOverview({ data }: FinancialOverviewProps) {
  const metrics = [
    {
      title: 'Total Revenue',
      value: formatCurrency(data.total_revenue),
      description: `Trend: ${data.revenue_trend > 0 ? '+' : ''}${data.revenue_trend}%`,
      trend: data.revenue_trend,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(data.total_expenses),
      description: `Trend: ${data.expense_trend > 0 ? '+' : ''}${data.expense_trend}%`,
      trend: data.expense_trend,
      icon: CreditCard,
      color: 'red'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(data.net_profit),
      description: `Trend: ${data.profit_trend > 0 ? '+' : ''}${data.profit_trend}%`,
      trend: data.profit_trend,
      icon: BarChart3,
      color: 'blue'
    },
    {
      title: 'Outstanding Payments',
      value: formatCurrency(data.outstanding_payments),
      description: 'Pending collections',
      trend: null,
      icon: Wallet,
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-50 text-green-600',
      red: 'bg-red-50 text-red-600',
      blue: 'bg-blue-50 text-blue-600',
      orange: 'bg-orange-50 text-orange-600'
    }
    return colors[color] || 'bg-gray-50 text-gray-600'
  }

  const getTrendColor = (trend: number) => {
    return trend > 0 ? 'text-green-500' : 'text-red-500'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <div className={`p-2 rounded-full ${getColorClasses(metric.color)}`}>
              <metric.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {metric.trend !== null && (
                metric.trend > 0 ? 
                <TrendingUp className={`h-3 w-3 mr-1 ${getTrendColor(metric.trend)}`} /> :
                <TrendingDown className={`h-3 w-3 mr-1 ${getTrendColor(metric.trend)}`} />
              )}
              {metric.description}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Cash Flow Indicator */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Cash Flow Status</h3>
              <p className="text-sm text-gray-600">
                Current financial health indicator
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              data.cash_flow === 'positive' 
                ? 'bg-green-100 text-green-800'
                : data.cash_flow === 'warning'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {data.cash_flow === 'positive' ? 'Healthy' : 
               data.cash_flow === 'warning' ? 'Monitor' : 'Critical'}
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(data.total_revenue)}
              </div>
              <div className="text-sm text-gray-600">Income</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(data.total_expenses)}
              </div>
              <div className="text-sm text-gray-600">Expenses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.net_profit)}
              </div>
              <div className="text-sm text-gray-600">Net</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
