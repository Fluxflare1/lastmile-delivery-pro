'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { apiClient } from '@/lib/api'
import MainLayout from '@/components/layout/main-layout'
import KPICards from '@/components/dashboard/kpi-cards'
import ActivityFeed from '@/components/dashboard/activity-feed'
import PerformanceCharts from '@/components/dashboard/performance-charts'
import RealTimeMap from '@/components/dashboard/real-time-map'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DashboardData {
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
  real_time_activity: Array<{
    order_id: string
    status: string
    courier: string
    eta: string
  }>
}

export default function DashboardPage() {
  const { user, tenant } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const data = await apiClient.getDashboardMetrics()
      setDashboardData(data)
      setError('')
    } catch (err: any) {
      setError('Failed to load dashboard data')
      console.error('Dashboard data error:', err)
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

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time business performance and operational metrics for {tenant?.name}
          </p>
        </div>

        {/* KPI Cards */}
        {dashboardData && <KPICards data={dashboardData} />}

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
            <TabsTrigger value="activity">Real-time Activity</TabsTrigger>
            <TabsTrigger value="operations">Operations Map</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <PerformanceCharts data={dashboardData} />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Activity Feed</CardTitle>
                  <CardDescription>
                    Real-time order and courier updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityFeed activities={dashboardData?.real_time_activity || []} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common operational tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-semibold">Create New Order</div>
                      <div className="text-sm text-gray-600">Manual order creation</div>
                    </button>
                    <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-semibold">Manage Couriers</div>
                      <div className="text-sm text-gray-600">View and assign couriers</div>
                    </button>
                    <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-semibold">Generate Reports</div>
                      <div className="text-sm text-gray-600">Download performance reports</div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operations">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Operations Map</CardTitle>
                <CardDescription>
                  Live courier locations and delivery routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RealTimeMap />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
