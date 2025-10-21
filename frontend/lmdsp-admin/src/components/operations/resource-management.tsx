'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Truck, Package, Clock, MapPin, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface ResourceManagementProps {
  resourceMetrics: any
  overview: any
}

const resourceData = {
  couriers: [
    { id: '1', name: 'John Courier', type: 'Motorcycle', status: 'active', location: 'Lagos Mainland', deliveries_today: 8, capacity: 12 },
    { id: '2', name: 'Sarah Driver', type: 'Car', status: 'active', location: 'Lagos Island', deliveries_today: 6, capacity: 10 },
    { id: '3', name: 'Mike Rider', type: 'Motorcycle', status: 'break', location: 'Ikeja Metro', deliveries_today: 5, capacity: 12 },
    { id: '4', name: 'Lisa Biker', type: 'Motorcycle', status: 'active', location: 'Lagos Mainland', deliveries_today: 7, capacity: 12 },
    { id: '5', name: 'David Trucker', type: 'Van', status: 'maintenance', location: 'Depot', deliveries_today: 0, capacity: 8 }
  ],
  vehicles: [
    { id: '1', type: 'Motorcycle', count: 18, available: 15, maintenance: 2, utilization: 83 },
    { id: '2', type: 'Car', count: 4, available: 3, maintenance: 1, utilization: 75 },
    { id: '3', type: 'Van', count: 2, available: 1, maintenance: 1, utilization: 50 }
  ]
}

const shiftSchedule = [
  { shift: 'Morning (6AM - 2PM)', couriers: 8, capacity: 96, utilization: 85 },
  { shift: 'Afternoon (2PM - 10PM)', couriers: 10, capacity: 120, utilization: 92 },
  { shift: 'Night (10PM - 6AM)', couriers: 4, capacity: 48, utilization: 65 },
  { shift: 'Flexible', couriers: 2, capacity: 24, utilization: 45 }
]

export default function ResourceManagement({ resourceMetrics, overview }: ResourceManagementProps) {
  const [activeTab, setActiveTab] = useState<'couriers' | 'vehicles' | 'shifts'>('couriers')

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      break: { label: 'On Break', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      maintenance: { label: 'Maintenance', color: 'bg-red-100 text-red-800', icon: XCircle }
    }[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: AlertTriangle }

    const IconComponent = config.icon

    return (
      <Badge variant="secondary" className={config.color}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600'
    if (utilization >= 80) return 'text-yellow-600'
    if (utilization >= 60) return 'text-green-600'
    return 'text-blue-600'
  }

  const getCapacityPercentage = (deliveries: number, capacity: number) => {
    return Math.min(100, (deliveries / capacity) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Resource Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {resourceMetrics?.courier_utilization || 78}%
                </div>
                <div className="text-sm text-gray-600">Courier Utilization</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {resourceMetrics?.vehicle_utilization || 82}%
                </div>
                <div className="text-sm text-gray-600">Vehicle Utilization</div>
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
                  {resourceMetrics?.peak_hour_capacity || 85}%
                </div>
                <div className="text-sm text-gray-600">Peak Hour Capacity</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Tabs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex space-x-4 border-b">
              <button
                className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'couriers'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('couriers')}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Couriers
              </button>
              <button
                className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'vehicles'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('vehicles')}
              >
                <Truck className="h-4 w-4 inline mr-2" />
                Vehicles
              </button>
              <button
                className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'shifts'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('shifts')}
              >
                <Clock className="h-4 w-4 inline mr-2" />
                Shift Schedule
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'couriers' && (
              <div className="space-y-4">
                {resourceData.couriers.map((courier) => (
                  <div
                    key={courier.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{courier.name}</div>
                        <div className="text-sm text-gray-500">{courier.type}</div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {courier.location}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {courier.deliveries_today}/{courier.capacity}
                      </div>
                      <div className="text-xs text-gray-500">deliveries</div>
                    </div>

                    <div className="w-20">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${getCapacityPercentage(courier.deliveries_today, courier.capacity)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      {getStatusBadge(courier.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'vehicles' && (
              <div className="space-y-4">
                {resourceData.vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Truck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{vehicle.type}</div>
                        <div className="text-sm text-gray-500">
                          {vehicle.available} available of {vehicle.count}
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium">{vehicle.maintenance}</div>
                      <div className="text-xs text-gray-500">in maintenance</div>
                    </div>

                    <div className="text-center">
                      <div className={`text-sm font-medium ${getUtilizationColor(vehicle.utilization)}`}>
                        {vehicle.utilization}%
                      </div>
                      <div className="text-xs text-gray-500">utilization</div>
                    </div>

                    <div className="w-20">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            vehicle.utilization >= 90 ? 'bg-red-500' :
                            vehicle.utilization >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${vehicle.utilization}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shifts' && (
              <div className="space-y-4">
                {shiftSchedule.map((shift, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{shift.shift}</div>
                      <div className="text-sm text-gray-500">
                        {shift.couriers} couriers • {shift.capacity} capacity
                      </div>
                    </div>

                    <div className="text-center">
                      <div className={`text-sm font-medium ${getUtilizationColor(shift.utilization)}`}>
                        {shift.utilization}%
                      </div>
                      <div className="text-xs text-gray-500">utilization</div>
                    </div>

                    <div className="w-32">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            shift.utilization >= 90 ? 'bg-red-500' :
                            shift.utilization >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${shift.utilization}%` }}
                        ></div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resource Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Allocation</CardTitle>
            <CardDescription>
              Current resource distribution and availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Availability Summary */}
              <div className="space-y-4">
                <h4 className="font-medium">Availability Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Couriers</span>
                    <span className="font-medium">
                      {resourceData.couriers.filter(c => c.status === 'active').length}/
                      {resourceData.couriers.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Available Vehicles</span>
                    <span className="font-medium">
                      {resourceData.vehicles.reduce((acc, v) => acc + v.available, 0)}/
                      {resourceData.vehicles.reduce((acc, v) => acc + v.count, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Standby Resources</span>
                    <span className="font-medium">
                      {resourceMetrics?.standby_resources || 4}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Allocation */}
              <div className="space-y-3">
                <h4 className="font-medium">Quick Allocation</h4>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Assign Courier to Zone
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Truck className="h-4 w-4 mr-2" />
                  Deploy Reserve Vehicle
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Adjust Shift Schedule
                </Button>
              </div>

              {/* Resource Alerts */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Resource Alert</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Peak hours (2PM-6PM) are approaching. Consider activating standby couriers to handle increased demand.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Performance Metrics</CardTitle>
          <CardDescription>
            Key performance indicators for resource management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {resourceMetrics?.courier_utilization || 78}%
              </div>
              <div className="text-sm text-gray-600">Courier Utilization</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {resourceMetrics?.vehicle_utilization || 82}%
              </div>
              <div className="text-sm text-gray-600">Vehicle Utilization</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {resourceMetrics?.peak_hour_capacity || 85}%
              </div>
              <div className="text-sm text-gray-600">Peak Capacity</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(
                  resourceData.couriers.reduce((acc, c) => acc + c.deliveries_today, 0) /
                  resourceData.couriers.reduce((acc, c) => acc + c.capacity, 0) * 100
                )}%
              </div>
              <div className="text-sm text-gray-600">Overall Utilization</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
