import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Package, Clock, CheckCircle, DollarSign } from 'lucide-react'

interface KPICardsProps {
  data: {
    overview: {
      total_orders: number
      completed_orders: number
      pending_orders: number
      success_rate: number
      average_delivery_time: string
    }
    revenue: {
      total_revenue: number
      revenue_trend: number
      average_order_value: number
    }
    performance: {
      on_time_delivery: number
      customer_satisfaction: number
      courier_performance: number
    }
  }
}

export default function KPICards({ data }: KPICardsProps) {
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    return `${hours}h ${minutes}m`
  }

  const kpis = [
    {
      title: 'Total Orders',
      value: data.overview.total_orders.toLocaleString(),
      description: 'All-time orders processed',
      icon: Package,
      trend: null,
      color: 'blue'
    },
    {
      title: 'Success Rate',
      value: `${data.overview.success_rate}%`,
      description: 'Successful deliveries',
      icon: CheckCircle,
      trend: data.overview.success_rate > 95 ? 'up' : 'down',
      color: 'green'
    },
    {
      title: 'Avg Delivery Time',
      value: formatTime(data.overview.average_delivery_time),
      description: 'Average completion time',
      icon: Clock,
      trend: null,
      color: 'purple'
    },
    {
      title: 'Today\'s Revenue',
      value: `₦${data.revenue.total_revenue.toLocaleString()}`,
      description: `Trend: ${data.revenue.revenue_trend > 0 ? '+' : ''}${data.revenue.revenue_trend}%`,
      icon: DollarSign,
      trend: data.revenue.revenue_trend > 0 ? 'up' : 'down',
      color: 'emerald'
    },
    {
      title: 'On-Time Delivery',
      value: `${data.performance.on_time_delivery}%`,
      description: 'SLA compliance rate',
      icon: TrendingUp,
      trend: data.performance.on_time_delivery > 95 ? 'up' : 'down',
      color: 'orange'
    },
    {
      title: 'Customer Satisfaction',
      value: `${data.performance.customer_satisfaction}/5`,
      description: 'Average rating',
      icon: TrendingUp,
      trend: data.performance.customer_satisfaction > 4.5 ? 'up' : 'down',
      color: 'indigo'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      emerald: 'bg-emerald-50 text-emerald-600',
      orange: 'bg-orange-50 text-orange-600',
      indigo: 'bg-indigo-50 text-indigo-600'
    }
    return colors[color] || 'bg-gray-50 text-gray-600'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <div className={`p-2 rounded-full ${getColorClasses(kpi.color)}`}>
              <kpi.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {kpi.trend && (
                kpi.trend === 'up' ? 
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" /> :
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {kpi.description}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
