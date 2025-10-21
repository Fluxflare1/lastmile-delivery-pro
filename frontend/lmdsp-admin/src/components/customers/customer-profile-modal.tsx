'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, User, Mail, Phone, Calendar, Package, Star, MapPin, MessageSquare } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  total_orders: number
  total_spent: number
  last_order_date: string
  customer_since: string
  status: 'active' | 'inactive' | 'new'
  segment: 'regular' | 'premium' | 'new'
  satisfaction_score: number
}

interface CustomerProfileModalProps {
  customer: Customer
  onClose: () => void
}

const orderHistory = [
  {
    id: 'LMDSP-BR-150924-001',
    date: '2024-01-15T10:30:00Z',
    service: 'On-Demand',
    status: 'delivered',
    amount: 3200,
    rating: 5
  },
  {
    id: 'LMDSP-BR-140924-002',
    date: '2024-01-14T14:20:00Z',
    service: 'Outstation',
    status: 'delivered',
    amount: 8500,
    rating: 4
  },
  {
    id: 'LMDSP-BR-120924-003',
    date: '2024-01-12T16:45:00Z',
    service: 'On-Demand',
    status: 'delivered',
    amount: 2100,
    rating: 5
  }
]

const communicationHistory = [
  {
    type: 'support_ticket',
    subject: 'Delivery Delay Inquiry',
    status: 'resolved',
    date: '2024-01-10T11:30:00Z',
    last_update: '2024-01-10T14:45:00Z'
  },
  {
    type: 'feedback',
    subject: 'Service Feedback',
    status: 'closed',
    date: '2024-01-05T09:15:00Z',
    last_update: '2024-01-05T09:15:00Z'
  },
  {
    type: 'general_inquiry',
    subject: 'Pricing Information',
    status: 'resolved',
    date: '2023-12-20T16:20:00Z',
    last_update: '2023-12-20T17:30:00Z'
  }
]

export default function CustomerProfileModal({ customer, onClose }: CustomerProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'communications'>('overview')

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'Active', color: 'bg-green-100 text-green-800' },
      inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
      new: { label: 'New', color: 'bg-blue-100 text-blue-800' }
    }[status] || { label: status, color: 'bg-gray-100 text-gray-800' }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getSegmentBadge = (segment: string) => {
    const config = {
      regular: { label: 'Regular', color: 'bg-gray-100 text-gray-800' },
      premium: { label: 'Premium', color: 'bg-purple-100 text-purple-800' },
      new: { label: 'New', color: 'bg-blue-100 text-blue-800' }
    }[segment] || { label: segment, color: 'bg-gray-100 text-gray-800' }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getOrderStatusBadge = (status: string) => {
    const config = {
      delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
      in_transit: { label: 'In Transit', color: 'bg-orange-100 text-orange-800' },
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' }
    }[status] || { label: status, color: 'bg-gray-100 text-gray-800' }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-xl">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{customer.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge(customer.status)}
                {getSegmentBadge(customer.segment)}
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  {customer.satisfaction_score}/5
                </div>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            <button
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <User className="h-4 w-4 inline mr-2" />
              Overview
            </button>
            <button
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              <Package className="h-4 w-4 inline mr-2" />
              Order History
            </button>
            <button
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'communications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('communications')}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Communications
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="h-4 w-4 inline mr-2" />
                        Full Name
                      </label>
                      <div className="text-gray-900">{customer.name}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Email Address
                      </label>
                      <div className="text-gray-900">{customer.email}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Phone Number
                      </label>
                      <div className="text-gray-900">{customer.phone}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="h-4 w-4 inline mr-2" />
                        Customer Since
                      </label>
                      <div className="text-gray-900">
                        {new Date(customer.customer_since).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Metrics */}
              <div>
                <h3 className="text-lg font-medium mb-4">Customer Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{customer.total_orders}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(customer.total_spent)}
                    </div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(customer.total_spent / customer.total_orders)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Order Value</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {customer.satisfaction_score}/5
                    </div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">Last Order</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(customer.last_order_date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        {getOrderStatusBadge('delivered')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Order History</h3>
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderHistory.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.date)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{order.service}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(order.amount)}</td>
                        <td className="px-6 py-4">{getOrderStatusBadge(order.status)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < order.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'communications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Communication History</h3>
              <div className="space-y-3">
                {communicationHistory.map((comm, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900">{comm.subject}</div>
                        <div className="text-sm text-gray-500 capitalize">{comm.type.replace('_', ' ')}</div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        comm.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {comm.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Opened: {formatDate(comm.date)}</span>
                      <span>Last update: {formatDate(comm.last_update)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button>
              Create Support Ticket
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
