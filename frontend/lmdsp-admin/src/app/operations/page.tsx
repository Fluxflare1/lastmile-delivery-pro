'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { apiClient } from '@/lib/api'
import MainLayout from '@/components/layout/main-layout'
import ServiceAreaManagement from '@/components/operations/service-area-management'
import RouteOptimization from '@/components/operations/route-optimization'
import ResourceManagement from '@/components/operations/resource-management'
import CapacityPlanning from '@/components/operations/capacity-planning'
import OperationalEfficiency from '@/components/operations/operational-efficiency'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Route, Users, TrendingUp, RefreshCw, Download } from 'lucide-react'

export default function OperationsPage() {
  const { user, tenant } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [operationsData, setOperationsData] = useState<any>(null)

  useEffect(() => {
    fetchOperationsData()
  }, [])

  const fetchOperationsData = async () => {
    try {
      setIsLoading(true)
      // Mock data - in real app, this would come from API
      const mockData = {
        overview: {
          active_zones: 8,
          total_couriers: 24,
          daily_capacity: 350,
          utilization_rate: 78,
          on_time_performance: 94.2,
          route_efficiency: 88.5
        },
        service_areas: [
          {
            id: '1',
            name: 'Lagos Mainland',
            type: 'premium',
            coverage: 'Mainland areas',
            couriers_assigned: 8,
            daily_capacity: 120,
            status: 'active'
          },
          {
            id: '2',
            name: 'Lagos Island',
            type: 'premium',
            coverage: 'Victoria Island, Ikoyi',
            couriers_assigned: 6,
            daily_capacity: 90,
            status: 'active'
          },
          {
            id: '3',
            name: 'Ikeja Metro',
            type: 'standard',
            coverage: 'Ikeja and environs',
            couriers_assigned: 5,
            daily_capacity: 80,
            status: 'active'
          },
          {
            id: '4',
            name: 'Abeokuta Zone',
            type: 'outstation',
            coverage: 'Abeokuta and surrounding',
            couriers_assigned: 3,
            daily_capacity: 40,
            status: 'active'
          }
        ],
        route_metrics: {
          optimized_routes: 45,
          average_route_time: '2.3 hours',
          fuel_savings: 18.5,
          delivery_success: 96.8
        },
        resource_metrics: {
          courier_utilization: 78,
          vehicle_utilization: 82,
          peak_hour_capacity: 85,
          standby_resources: 4
        }
      }
      setOperationsData(mockData)
      setError('')
    } catch (err: any) {
      setError('Failed to load operations data')
      console.error('Operations data fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Operations Management</h1>
            <p className="text-gray-600 mt-2">
              Service areas, route optimization, and resource planning for {tenant?.name}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={fetchOperationsData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {error ? (
          <div className="text-center py-8">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p className="text-gray-600">{error}</p>
            <Button onClick={fetchOperationsData} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Operations Overview */}
            {operationsData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {operationsData.overview.active_zones}
                        </div>
                        <div className="text-sm text-gray-600">Active Zones</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {operationsData.overview.total_couriers}
                        </div>
                        <div className="text-sm text-gray-600">Total Couriers</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <Route className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {operationsData.overview.daily_capacity}
                        </div>
                        <div className="text-sm text-gray-600">Daily Capacity</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg mr-3">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {operationsData.overview.utilization_rate}%
                        </div>
                        <div className="text-sm text-gray-600">Utilization Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Main Content Tabs */}
            <Tabs defaultValue="service-areas" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="service-areas">Service Areas</TabsTrigger>
                <TabsTrigger value="route-optimization">Route Optimization</TabsTrigger>
                <TabsTrigger value="resource-management">Resource Management</TabsTrigger>
                <TabsTrigger value="capacity-planning">Capacity Planning</TabsTrigger>
                <TabsTrigger value="efficiency">Operational Efficiency</TabsTrigger>
              </TabsList>

              <TabsContent value="service-areas" className="space-y-6">
                <ServiceAreaManagement 
                  serviceAreas={operationsData?.service_areas || []}
                  overview={operationsData?.overview}
                />
              </TabsContent>

              <TabsContent value="route-optimization" className="space-y-6">
                <RouteOptimization 
                  routeMetrics={operationsData?.route_metrics}
                  overview={operationsData?.overview}
                />
              </TabsContent>

              <TabsContent value="resource-management" className="space-y-6">
                <ResourceManagement 
                  resourceMetrics={operationsData?.resource_metrics}
                  overview={operationsData?.overview}
                />
              </TabsContent>

              <TabsContent value="capacity-planning" className="space-y-6">
                <CapacityPlanning 
                  overview={operationsData?.overview}
                  serviceAreas={operationsData?.service_areas || []}
                />
              </TabsContent>

              <TabsContent value="efficiency" className="space-y-6">
                <OperationalEfficiency 
                  overview={operationsData?.overview}
                  routeMetrics={operationsData?.route_metrics}
                  resourceMetrics={operationsData?.resource_metrics}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  )
}
