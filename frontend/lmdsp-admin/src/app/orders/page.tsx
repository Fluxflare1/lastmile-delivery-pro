'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { apiClient } from '@/lib/api'
import MainLayout from '@/components/layout/main-layout'
import OrderList from '@/components/orders/order-list'
import OrderFilters from '@/components/orders/order-filters'
import CreateOrderModal from '@/components/orders/create-order-modal'
import BulkOperationsModal from '@/components/orders/bulk-operations-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Upload, Download, RefreshCw } from 'lucide-react'
import { Order } from '@/types'

export default function OrdersPage() {
  const { user, tenant } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    service_type: '',
    date_range: '',
    search: ''
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [orders, filters])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.getOrders()
      setOrders(data.orders || [])
      setError('')
    } catch (err: any) {
      setError('Failed to load orders')
      console.error('Orders fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...orders]

    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status)
    }

    if (filters.service_type) {
      filtered = filtered.filter(order => order.service_type === filters.service_type)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(order => 
        order.tracking_number.toLowerCase().includes(searchLower) ||
        order.pickup_address.contact_name.toLowerCase().includes(searchLower) ||
        order.delivery_address.contact_name.toLowerCase().includes(searchLower)
      )
    }

    setFilteredOrders(filtered)
  }

  const handleCreateOrder = async (orderData: any) => {
    try {
      const newOrder = await apiClient.createOrder(orderData)
      setOrders(prev => [newOrder, ...prev])
      setShowCreateModal(false)
      return newOrder
    } catch (error) {
      throw error
    }
  }

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ))
  }

  const handleAssignment = (orderId: string, courierId: string) => {
    // This would typically call the API, but we'll update locally for now
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { 
        ...order, 
        status: 'assigned',
        assigned_courier: { id: courierId, name: 'Assigned Courier', phone: '', email: '', vehicle_type: 'bike', status: 'busy' }
      } : order
    ))
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
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-2">
              Manage and track all delivery orders for {tenant?.name}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setShowBulkModal(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
            <Button
              variant="outline"
              onClick={() => {/* Export functionality */}}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {orders.filter(o => o.status === 'pending' || o.status === 'assigned').length}
              </div>
              <div className="text-sm text-gray-600">Active Orders</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {orders.filter(o => o.service_type === 'on_demand').length}
              </div>
              <div className="text-sm text-gray-600">On-Demand</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Order Filters</CardTitle>
                <CardDescription>
                  Filter and search through your orders
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <OrderFilters
              filters={filters}
              onFiltersChange={setFilters}
              orderCount={filteredOrders.length}
            />
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              {filteredOrders.length} orders found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <div className="text-red-500 text-xl mb-2">⚠️</div>
                <p className="text-gray-600">{error}</p>
                <Button onClick={fetchOrders} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : (
              <OrderList
                orders={filteredOrders}
                onStatusUpdate={handleStatusUpdate}
                onAssignment={handleAssignment}
              />
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        {showCreateModal && (
          <CreateOrderModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateOrder}
          />
        )}

        {showBulkModal && (
          <BulkOperationsModal
            onClose={() => setShowBulkModal(false)}
            onSuccess={() => {
              setShowBulkModal(false)
              fetchOrders()
            }}
          />
        )}
      </div>
    </MainLayout>
  )
}
