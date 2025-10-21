'use client'

import { useState } from 'react'
import { Order } from '@/types'
import { formatCurrency, formatDate, getOrderStatusColor } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Truck, MapPin, Phone } from 'lucide-react'
import OrderStatusBadge from './order-status-badge'
import AssignCourierModal from './assign-courier-modal'

interface OrderListProps {
  orders: Order[]
  onStatusUpdate: (orderId: string, newStatus: string) => void
  onAssignment: (orderId: string, courierId: string) => void
}

export default function OrderList({ orders, onStatusUpdate, onAssignment }: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [actionOrder, setActionOrder] = useState<Order | null>(null)

  const handleAssignCourier = (order: Order) => {
    setActionOrder(order)
    setShowAssignModal(true)
  }

  const handleAssignmentConfirm = (courierId: string) => {
    if (actionOrder) {
      onAssignment(actionOrder.id, courierId)
      setShowAssignModal(false)
      setActionOrder(null)
    }
  }

  const getNextStatus = (currentStatus: string): string | null => {
    const statusFlow: Record<string, string> = {
      'pending': 'assigned',
      'assigned': 'picked_up',
      'picked_up': 'in_transit',
      'in_transit': 'delivered'
    }
    return statusFlow[currentStatus] || null
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
        <p className="text-gray-500 mb-6">
          {orders.length === 0 ? "You don't have any orders yet." : "No orders match your current filters."}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Courier
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              const nextStatus = getNextStatus(order.status)
              
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{order.tracking_number}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.pickup_address.contact_name} → {order.delivery_address.contact_name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {order.pickup_address.city} to {order.delivery_address.city}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.service_type === 'on_demand' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {order.service_type === 'on_demand' ? 'On-Demand' : 'Outstation'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.assigned_courier ? (
                      <div className="text-sm text-gray-900">
                        {order.assigned_courier.name}
                        <div className="text-xs text-gray-500">
                          {order.assigned_courier.vehicle_type}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(order.estimated_cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {!order.assigned_courier && order.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignCourier(order)}
                        >
                          <Truck className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                      )}
                      
                      {nextStatus && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStatusUpdate(order.id, nextStatus)}
                        >
                          Mark as {nextStatus.replace('_', ' ')}
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Assign Courier Modal */}
      {showAssignModal && actionOrder && (
        <AssignCourierModal
          order={actionOrder}
          onClose={() => {
            setShowAssignModal(false)
            setActionOrder(null)
          }}
          onAssign={handleAssignmentConfirm}
        />
      )}

      {/* Order Details Modal would go here */}
    </>
  )
}
