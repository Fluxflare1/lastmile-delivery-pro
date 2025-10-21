'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Package, Calendar, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react'

interface CapacityPlanningProps {
  overview: any
  serviceAreas: any[]
}

const demandForecast = [
  { period: 'Next Week', expected_demand: 1850, capacity: 2100, gap: 250, status: 'healthy' },
  { period: 'Next Month', expected_demand: 7800, capacity: 8400, gap: 600, status: 'healthy' },
  { period: 'Next Quarter', expected_demand: 24500, capacity: 25200, gap: 700, status: 'monitor' },
  { period: 'Next 6 Months', expected_demand: 52000, capacity: 50400, gap: -1600, status: 'critical' }
]

const seasonalTrends = [
  { month: 'January', demand: 2200, capacity: 2100, trend: 'high' },
  { month: 'February', demand: 2400, capacity: 2100, trend: 'high' },
  { month: 'March', demand: 2100, capacity: 2100, trend: 'normal' },
  { month: 'April', demand: 1900, capacity: 2100, trend: 'low' },
  { month: 'May', demand: 1800, capacity: 2100, trend: 'low' },
  { month: 'June', demand: 2000, capacity: 2100, trend: 'normal' },
  { month: 'July', demand: 2300, capacity: 2100, trend: 'high' },
  { month: 'August', demand: 2500, capacity: 2100, trend: 'high' },
  { month: 'September', demand: 2200, capacity: 2100, trend: 'high' },
  { month: 'October', demand: 2100, capacity: 2100, trend: 'normal' },
  { month: 'November', demand: 2300, capacity: 2100, trend: 'high' },
  { month: 'December', demand: 2800, capacity: 2100, trend: 'peak' }
]

const expansionOpportunities = [
  { area: 'Ikorodu Zone', potential_demand: 450, current_capacity: 0, investment: 1200000, roi: 35 },
  { area: 'Lekki Phase 2', potential_demand: 380, current_capacity: 120, investment: 800000, roi: 42 },
  { area: 'Ajah Metro', potential_demand: 320, current_capacity: 80, investment: 600000, roi: 38 },
  { area: 'Badagry Corridor', potential_demand: 280, current_capacity: 0, investment: 900000, roi: 28 }
]

export default function CapacityPlanning({ overview, serviceAreas }: CapacityPlanningProps) {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'quarterly'>('monthly')

  const getStatusBadge = (status: string) => {
    const config = {
      healthy: { label: 'Healthy', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      monitor: { label: 'Monitor', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      critical: { label: 'Critical', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    }[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: AlertTriangle }

    const IconComponent = config.icon

    return (
      <Badge variant="secondary" className={config.color}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getTrendBadge = (trend: string) => {
    const config = {
      peak: { label: 'Peak', color: 'bg-red-100 text-red-800' },
      high: { label: 'High', color: 'bg-orange-100 text-orange-800' },
      normal: { label: 'Normal', color: 'bg-green-100 text-green-800' },
      low: { label: 'Low', color: 'bg-blue-100 text-blue-800' }
    }[trend] || { label: trend, color: 'bg-gray-100 text-gray-800' }

    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const calculateCapacityGap = (demand: number, capacity: number) => {
    const gap = capacity - demand
    const percentage = (gap / capacity) * 100
    return { gap, percentage }
  }

  return (
    <div className="space-y-6">
      {/* Capacity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {overview?.daily_capacity || 350}
                </div>
                <div className="text-sm text-gray-600">Daily Capacity</div>
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
                  {overview?.utilization_rate || 78}%
                </div>
                <div className="text-sm text-gray-600">Current Utilization</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.ceil((overview?.daily_capacity || 350) * 0.3)}
                </div>
                <div className="text-sm text-gray-600">Buffer Capacity</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Demand Forecast vs Capacity</CardTitle>
            <CardDescription>
              Projected demand against current capacity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demandForecast.map((forecast, index) => {
                const { gap, percentage } = calculateCapacityGap(forecast.expected_demand, forecast.capacity)
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{forecast.period}</div>
                      <div className="text-sm text-gray-500">
                        Demand: {forecast.expected_demand.toLocaleString()} • Capacity: {forecast.capacity.toLocaleString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        gap >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {gap >= 0 ? `+${gap}` : gap} capacity
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.abs(percentage).toFixed(1)}% {gap >= 0 ? 'surplus' : 'deficit'}
                      </div>
                    </div>

                    <div>
                      {getStatusBadge(forecast.status)}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Seasonal Demand Trends</CardTitle>
            <CardDescription>
              Monthly demand patterns and capacity requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {seasonalTrends.map((trend, index) => {
                const { gap, percentage } = calculateCapacityGap(trend.demand, trend.capacity)
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{trend.month}</div>
                      <div className="text-sm text-gray-500">
                        {trend.demand.toLocaleString()} deliveries
                      </div>
                    </div>

                    <div className="flex-1 text-center">
                      {getTrendBadge(trend.trend)}
                    </div>

                    <div className="flex-1 text-right">
                      <div className={`text-sm font-medium ${
                        gap >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {gap >= 0 ? 'Surplus' : 'Deficit'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.abs(gap)} deliveries
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Capacity Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Capacity Recommendations</CardTitle>
            <CardDescription>
              Suggested actions based on capacity analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Immediate Action</span>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Hire 3-5 additional couriers to handle projected Q3 demand increase.
                </p>
                <Button size="sm" variant="outline">
                  View Recruitment Plan
                </Button>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">Medium Term</span>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  Expand vehicle fleet by 2 cars and 3 motorcycles for next quarter.
                </p>
                <Button size="sm" variant="outline">
                  Fleet Expansion Plan
                </Button>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-900">Long Term</span>
                </div>
                <p className="text-sm text-purple-700 mb-3">
                  Consider opening new service zones in high-demand areas.
                </p>
                <Button size="sm" variant="outline">
                  Expansion Strategy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expansion Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Expansion Opportunities</CardTitle>
            <CardDescription>
              Potential areas for service expansion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expansionOpportunities.map((opportunity, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{opportunity.area}</div>
                    <Badge variant="secondary" className={
                      opportunity.roi >= 40 ? 'bg-green-100 text-green-800' :
                      opportunity.roi >= 30 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      ROI: {opportunity.roi}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <div className="text-gray-600">Potential Demand</div>
                      <div className="font-medium">{opportunity.potential_demand}/day</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Investment</div>
                      <div className="font-medium">₦{opportunity.investment.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Analyze
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Capacity Planning Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity Planning Metrics</CardTitle>
          <CardDescription>
            Key indicators for capacity planning and optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {(overview?.daily_capacity * 30).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Monthly Capacity</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((overview?.daily_capacity || 350) * 0.3)}
              </div>
              <div className="text-sm text-gray-600">Ideal Buffer</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {serviceAreas.length}
              </div>
              <div className="text-sm text-gray-600">Service Zones</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.ceil((overview?.total_couriers || 24) * 1.2)}
              </div>
              <div className="text-sm text-gray-600">Target Couriers</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
