'use client'

import { useState } from 'react'
import { Courier } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, User, Phone, Mail, MapPin, Car, Star, Calendar, Package } from 'lucide-react'
import CourierStatusBadge from './courier-status-badge'

interface CourierProfileModalProps {
  courier: Courier
  onClose: () => void
  onUpdate: (courier: Courier) => void
}

export default function CourierProfileModal({ courier, onClose, onUpdate }: CourierProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'performance' | 'earnings'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: courier.name,
    email: courier.email,
    phone: courier.phone,
    vehicle_type: courier.vehicle_type
  })

  const handleSave = () => {
    onUpdate({
      ...courier,
      ...formData
    })
    setIsEditing(false)
  }

  const performanceData = {
    totalDeliveries: 245,
    successRate: 98.5,
    averageRating: 4.8,
    onTimeRate: 94.2,
    totalEarnings: 1250000,
    thisMonthEarnings: 145000
  }

  const recentActivities = [
    { id: 1, type: 'delivery', order: 'LMDSP-BR-150924-001', status: 'completed', time: '2 hours ago' },
    { id: 2, type: 'delivery', order: 'LMDSP-BR-150924-002', status: 'completed', time: '4 hours ago' },
    { id: 3, type: 'delivery', order: 'LMDSP-BR-150924-003', status: 'in_progress', time: 'Currently' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-xl">
                {courier.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{courier.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <CourierStatusBadge status={courier.status} />
                <span className="text-sm text-gray-500">{courier.vehicle_type}</span>
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
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="h-4 w-4 inline mr-2" />
              Profile
            </button>
            <button
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'performance'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('performance')}
            >
              <Star className="h-4 w-4 inline mr-2" />
              Performance
            </button>
            <button
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'earnings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('earnings')}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Earnings
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <div className="text-gray-900">{courier.name}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    <div className="text-gray-900">{courier.email}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <div className="text-gray-900">{courier.phone}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Car className="h-4 w-4 inline mr-2" />
                    Vehicle Type
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.vehicle_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, vehicle_type: e.target.value }))}
                      className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm"
                    >
                      <option value="bike">Motorcycle</option>
                      <option value="car">Car</option>
                      <option value="van">Van</option>
                      <option value="truck">Truck</option>
                    </select>
                  ) : (
                    <div className="text-gray-900">{courier.vehicle_type}</div>
                  )}
                </div>
              </div>

              {/* Current Location */}
              {courier.current_location && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Current Location
                  </label>
                  <div className="text-gray-900">
                    {courier.current_location.lat.toFixed(4)}, {courier.current_location.lng.toFixed(4)}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Performance Metrics</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{performanceData.totalDeliveries}</div>
                  <div className="text-sm text-gray-600">Total Deliveries</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{performanceData.successRate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{performanceData.averageRating}/5</div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{performanceData.onTimeRate}%</div>
                  <div className="text-sm text-gray-600">On-Time Rate</div>
                </div>
              </div>

              {/* Recent Activities */}
              <div>
                <h4 className="font-medium mb-4">Recent Activities</h4>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{activity.order}</div>
                          <div className="text-sm text-gray-500">{activity.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-medium ${
                          activity.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {activity.status === 'completed' ? 'Completed' : 'In Progress'}
                        </div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Earnings Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    ₦{performanceData.totalEarnings.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Earnings</div>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    ₦{performanceData.thisMonthEarnings.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">This Month</div>
                </div>
              </div>

              {/* Commission Structure */}
              <div>
                <h4 className="font-medium mb-4">Commission Structure</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Commission per Delivery:</span>
                    <span className="font-medium">₦450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance Bonus (per km):</span>
                    <span className="font-medium">₦25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peak Hours Bonus:</span>
                    <span className="font-medium">₦100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating Bonus (4.5+):</span>
                    <span className="font-medium">₦50</span>
                  </div>
                </div>
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
              Send Message
            </Button>
            <Button>
              View Full Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
