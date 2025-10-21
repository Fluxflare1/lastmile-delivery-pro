'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RefreshCw, Map, Clock, Fuel, TrendingUp, CheckCircle } from 'lucide-react'

interface RouteOptimizationProps {
  routeMetrics: any
  overview: any
}

const routeData = [
  {
    id: 'RT-001',
    courier: 'John Courier',
    vehicle: 'Motorcycle',
    stops: 8,
    estimated_time: '2.5 hours',
    distance: '28 km',
    status: 'optimized',
    efficiency: 92
  },
  {
    id: 'RT-002',
    courier: 'Sarah Driver',
    vehicle: 'Car',
    stops: 12,
    estimated_time: '3.2 hours',
    distance: '45 km',
    status: 'pending',
    efficiency: 85
  },
  {
    id: 'RT-003',
    courier: 'Mike Rider',
    vehicle: 'Motorcycle',
    stops: 6,
    estimated_time: '1.8 hours',
    distance: '22 km',
    status: 'optimized',
    efficiency: 95
  },
  {
    id: 'RT-004',
    courier: 'Lisa Biker',
    vehicle: 'Motorcycle',
    stops: 10,
    estimated_time: '2.8 hours',
    distance: '35 km',
    status: 'in_progress',
    efficiency: 88
  }
]

const optimizationStats = [
  { metric: 'Average Route Time', value: '2.3 hours', improvement: '15%', trend: 'up' },
  { metric: 'Fuel Savings', value: '18.5%', improvement: '12%', trend: 'up' },
  { metric: 'Delivery Success', value: '96.8%', improvement: '8%', trend: 'up' },
  { metric: 'Customer Satisfaction', value: '4.7/5', improvement: '6%', trend: 'up' }
]

export default function RouteOptimization({ routeMetrics, overview }: RouteOptimizationProps) {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    const config = {
      optimized: { label: 'Optimized', color: 'bg-green-100 text-green-800' },
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' }
    }[status] || { label: status, color: 'bg-gray-100 text-gray-800' }

    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600'
    if (efficiency >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleOptimizeRoute = (routeId: string) => {
    // Implement route optimization
    console.log('Optimizing route:', routeId)
  }

  const handleRerouteAll = () => {
    // Implement bulk rerouting
    console.log('Rerouting all pending routes')
  }

  return (
    <div className="space-y-6">
      {/* Optimization Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {optimizationStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.metric}</div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.improvement}
                  </div>
                  <div className="text-xs text-gray-500">vs last month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Routes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Routes</CardTitle>
                <CardDescription>
                  Real-time route optimization and monitoring
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleRerouteAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reroute All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routeData.map((route) => (
                <div
                  key={route.id}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                    selectedRoute === route.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Map className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{route.id}</div>
                      <div className="text-sm text-gray-500">{route.courier} • {route.vehicle}</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm font-medium">{route.stops} stops</div>
                    <div className="text-xs text-gray-500">deliveries</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center text-sm">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" />
                      {route.estimated_time}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Fuel className="h-3 w-3 mr-1" />
                      {route.distance}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className={`text-sm font-medium ${getEfficiencyColor(route.efficiency)}`}>
                      {route.efficiency}% eff.
                    </div>
                    {getStatusBadge(route.status)}
                  </div>

                  <div className="flex space-x-2">
                    {route.status !== 'optimized' && (
                      <Button
                        size="sm"
                        onClick={() => handleOptimizeRoute(route.id)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Optimization Controls</CardTitle>
            <CardDescription>
              Manage route optimization settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Optimization Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Optimization Parameters</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Traffic Consideration</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Weather Impact</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fuel Efficiency</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time Windows</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Partial
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="font-medium">Quick Actions</h4>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-optimize All Routes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Map className="h-4 w-4 mr-2" />
                  Generate New Routes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Performance Report
                </Button>
              </div>

              {/* Optimization Status */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">System Status</span>
                </div>
                <p className="text-sm text-blue-700">
                  Route optimization is running optimally. All systems are functioning within expected parameters.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Route Performance Analytics</CardTitle>
          <CardDescription>
            Key performance indicators for route optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {routeMetrics?.optimized_routes || 45}
              </div>
              <div className="text-sm text-gray-600">Optimized Routes</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {routeMetrics?.average_route_time || '2.3 hours'}
              </div>
              <div className="text-sm text-gray-600">Avg Route Time</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {routeMetrics?.fuel_savings || 18.5}%
              </div>
              <div className="text-sm text-gray-600">Fuel Savings</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {routeMetrics?.delivery_success || 96.8}%
              </div>
              <div className="text-sm text-gray-600">Delivery Success</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
