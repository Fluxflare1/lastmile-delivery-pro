'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Clock, Package, Users, Fuel, CheckCircle, AlertTriangle } from 'lucide-react'

interface OperationalEfficiencyProps {
  overview: any
  routeMetrics: any
  resourceMetrics: any
}

const efficiencyData = [
  { metric: 'Route Optimization', current: 88, target: 90, trend: 2 },
  { metric: 'Resource Utilization', current: 78, target: 85, trend: -3 },
  { metric: 'On-Time Performance', current: 94, target: 95, trend: 1 },
  { metric: 'Fuel Efficiency', current: 82, target: 85, trend: -1 },
  { metric: 'First Attempt Success', current: 96, target: 97, trend: 0 }
]

const kpiTrends = [
  { period: 'Jan', deliveries: 1850, efficiency: 85, cost_per_delivery: 245 },
  { period: 'Feb', deliveries: 2100, efficiency: 87, cost_per_delivery: 238 },
  { period: 'Mar', deliveries: 1950, efficiency: 84, cost_per_delivery: 252 },
  { period: 'Apr', deliveries: 2250, efficiency: 89, cost_per_delivery: 248 },
  { period: 'May', deliveries: 2300, efficiency: 88, cost_per_delivery: 255 },
  { period: 'Jun', deliveries: 2450, efficiency: 91, cost_per_delivery: 242 }
]

const processEfficiency = [
  { process: 'Order Processing', time: '15 min', target: '10 min', efficiency: 85 },
  { process: 'Courier Assignment', time: '8 min', target: '5 min', efficiency: 75 },
  { process: 'Route Planning', time: '12 min', target: '8 min', efficiency: 80 },
  { process: 'Delivery Execution', time: '2.3 hours', target: '2 hours', efficiency: 88 },
  { process: 'Proof of Delivery', time: '5 min', target: '3 min', efficiency: 70 }
]

const improvementAreas = [
  { area: 'Courier Training', impact: 'High', effort: 'Medium', priority: 'High', potential: 12 },
  { area: 'Route Algorithm', impact: 'High', effort: 'High', priority: 'High', potential: 18 },
  { area: 'Vehicle Maintenance', impact: 'Medium', effort: 'Low', priority: 'Medium', potential: 8 },
  { area: 'Dispatch System', impact: 'Medium', effort: 'Medium', priority: 'Medium', potential: 10 },
  { area: 'Customer Communication', impact: 'Low', effort: 'Low', priority: 'Low', potential: 5 }
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function OperationalEfficiency({ overview, routeMetrics, resourceMetrics }: OperationalEfficiencyProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600'
    if (efficiency >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPriorityBadge = (priority: string) => {
    const config = {
      High: { color: 'bg-red-100 text-red-800' },
      Medium: { color: 'bg-yellow-100 text-yellow-800' },
      Low: { color: 'bg-blue-100 text-blue-800' }
    }[priority] || { color: 'bg-gray-100 text-gray-800' }

    return (
      <Badge variant="secondary" className={config.color}>
        {priority}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Efficiency Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {overview?.route_efficiency || 88.5}%
                </div>
                <div className="text-sm text-gray-600">Route Efficiency</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {resourceMetrics?.courier_utilization || 78}%
                </div>
                <div className="text-sm text-gray-600">Resource Utilization</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {overview?.on_time_performance || 94.2}%
                </div>
                <div className="text-sm text-gray-600">On-Time Performance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Efficiency Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Efficiency Metrics</CardTitle>
            <CardDescription>
              Performance against targets across key operational areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {efficiencyData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.metric}</div>
                    <div className="text-sm text-gray-500">Target: {item.target}%</div>
                  </div>

                  <div className="flex-1 text-center">
                    <div className={`text-lg font-bold ${getEfficiencyColor(item.current)}`}>
                      {item.current}%
                    </div>
                  </div>

                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {getTrendIcon(item.trend)}
                      <span className={`text-sm ${item.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(item.trend)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">vs last month</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* KPI Trends */}
        <Card>
          <CardHeader>
            <CardTitle>KPI Trends</CardTitle>
            <CardDescription>
              Monthly operational performance trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={kpiTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="efficiency" name="Efficiency %" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="deliveries" name="Deliveries" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Process Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle>Process Efficiency</CardTitle>
            <CardDescription>
              Time and efficiency across operational processes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processEfficiency.map((process, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{process.process}</span>
                    <span className={`text-sm font-medium ${getEfficiencyColor(process.efficiency)}`}>
                      {process.efficiency}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Current: {process.time}</span>
                    <span>Target: {process.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        process.efficiency >= 90 ? 'bg-green-500' :
                        process.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${process.efficiency}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Improvement Areas */}
        <Card>
          <CardHeader>
            <CardTitle>Improvement Opportunities</CardTitle>
            <CardDescription>
              Areas with highest potential for efficiency gains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {improvementAreas.map((area, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{area.area}</div>
                    {getPriorityBadge(area.priority)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>
                      <div className="text-gray-600">Impact</div>
                      <div className="font-medium">{area.impact}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Effort</div>
                      <div className="font-medium">{area.effort}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Potential Gain</span>
                    <span className="text-sm font-medium text-green-600">+{area.potential}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Efficiency Distribution</CardTitle>
          <CardDescription>
            Performance distribution across operational areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={efficiencyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ metric, current }) => `${metric}: ${current}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="current"
                  >
                    {efficiencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Overall Efficiency Score</span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Math.round(
                    efficiencyData.reduce((acc, curr) => acc + curr.current, 0) / efficiencyData.length
                  )}%
                </div>
                <p className="text-sm text-blue-700">
                  Current operational efficiency across all key performance areas.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">Recommendations</span>
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Focus on courier training programs</li>
                  <li>• Optimize route planning algorithms</li>
                  <li>• Improve vehicle maintenance schedules</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Efficiency Improvement Action Plan</CardTitle>
          <CardDescription>
            Recommended actions to improve operational efficiency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium">Short Term (1-2 weeks)</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Review and optimize current routes</li>
                <li>• Implement quick courier training sessions</li>
                <li>• Address immediate maintenance issues</li>
              </ul>
              <Button size="sm" className="mt-3 w-full">
                View Plan
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Package className="h-5 w-5 text-green-500" />
                <h4 className="font-medium">Medium Term (1-3 months)</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Upgrade route optimization algorithms</li>
                <li>• Expand courier training program</li>
                <li>• Implement performance monitoring system</li>
              </ul>
              <Button size="sm" className="mt-3 w-full">
                View Plan
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <h4 className="font-medium">Long Term (3-6 months)</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Deploy advanced analytics platform</li>
                <li>• Expand to new service areas</li>
                <li>• Implement AI-powered optimization</li>
              </ul>
              <Button size="sm" className="mt-3 w-full">
                View Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
