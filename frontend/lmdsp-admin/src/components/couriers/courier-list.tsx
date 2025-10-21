'use client'

import { Courier } from '@/types'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Phone, Mail, MapPin, Star } from 'lucide-react'
import CourierStatusBadge from './courier-status-badge'

interface CourierListProps {
  couriers: Courier[]
  onStatusUpdate: (courierId: string, newStatus: string) => void
  onViewProfile: (courier: Courier) => void
}

export default function CourierList({ couriers, onStatusUpdate, onViewProfile }: CourierListProps) {
  const getNextStatus = (currentStatus: string): string | null => {
    const statusFlow: Record<string, string> = {
      'available': 'busy',
      'busy': 'available',
      'offline': 'available'
    }
    return statusFlow[currentStatus] || null
  }

  const getStatusActionLabel = (currentStatus: string): string => {
    const actions: Record<string, string> = {
      'available': 'Mark as Busy',
      'busy': 'Mark as Available',
      'offline': 'Activate'
    }
    return actions[currentStatus] || 'Update Status'
  }

  if (couriers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🚗</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No couriers found</h3>
        <p className="text-gray-500 mb-6">
          {couriers.length === 0 ? "You don't have any couriers yet." : "No couriers match your current filters."}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Courier
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vehicle
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Performance
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {couriers.map((courier) => {
            const nextStatus = getNextStatus(courier.status)
            
            return (
              <tr key={courier.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-indigo-600 font-semibold text-sm">
                        {courier.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {courier.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {courier.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    courier.vehicle_type === 'bike' 
                      ? 'bg-green-100 text-green-800'
                      : courier.vehicle_type === 'car'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {courier.vehicle_type === 'bike' ? 'Motorcycle' : 
                     courier.vehicle_type === 'car' ? 'Car' : 
                     courier.vehicle_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <CourierStatusBadge status={courier.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-1 text-gray-400" />
                      {courier.phone}
                    </div>
                    {courier.current_location && (
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        Near {courier.current_location.lat.toFixed(2)}, {courier.current_location.lng.toFixed(2)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      4.8/5
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      98% success rate
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {nextStatus && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStatusUpdate(courier.id, nextStatus)}
                      >
                        {getStatusActionLabel(courier.status)}
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewProfile(courier)}
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
  )
}
