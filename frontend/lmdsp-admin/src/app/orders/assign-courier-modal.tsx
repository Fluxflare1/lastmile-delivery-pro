'use client'

import { useState, useEffect } from 'react'
import { Order, Courier } from '@/types'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Search, MapPin, Star } from 'lucide-react'

interface AssignCourierModalProps {
  order: Order
  onClose: () => void
  onAssign: (courierId: string) => void
}

export default function AssignCourierModal({ order, onClose, onAssign }: AssignCourierModalProps) {
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [filteredCouriers, setFilteredCouriers] = useState<Courier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null)

  useEffect(() => {
    fetchAvailableCouriers()
  }, [])

  useEffect(() => {
    const filtered = couriers.filter(courier =>
      courier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courier.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCouriers(filtered)
  }, [couriers, searchTerm])

  const fetchAvailableCouriers = async () => {
    try {
      const data = await apiClient.getCouriers({ status: 'available' })
      setCouriers(data.couriers || [])
      setFilteredCouriers(data.couriers || [])
    } catch (error) {
      console.error('Failed to fetch couriers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssign = () => {
    if (selectedCourier) {
      onAssign(selectedCourier.id)
    }
  }

  const calculateDistance = (courierLocation: { lat: number; lng: number } | undefined) => {
    if (!courierLocation || !order.pickup_address.coordinates) return 'Unknown'
    
    // Simple distance calculation (in real app, use proper geospatial calculation)
    const R = 6371 // Earth's radius in km
    const dLat = (courierLocation.lat - order.pickup_address.coordinates.lat) * Math.PI / 180
    const dLon = (courierLocation.lng - order.pickup_address.coordinates.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(order.pickup_address.coordinates.lat * Math.PI / 180) * 
      Math.cos(courierLocation.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold">Assign Courier</h2>
            <p className="text-sm text-gray-600">
              Order #{order.tracking_number} - {order.pickup_address.city} to {order.delivery_address.city}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search couriers by name or vehicle type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Courier List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading available couriers...</p>
            </div>
          ) : filteredCouriers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">🚗</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No couriers available</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No couriers match your search.' : 'All couriers are currently busy.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCouriers.map((courier) => (
                <div
                  key={courier.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedCourier?.id === courier.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCourier(courier)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-sm">
                          {courier.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{courier.name}</div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <span>{courier.vehicle_type}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 mr-1" />
                            4.8
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 flex items-center justify-end">
                        <MapPin className="h-3 w-3 mr-1" />
                        {calculateDistance(courier.current_location)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {courier.current_location ? 'Near pickup' : 'Location unknown'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedCourier ? `Selected: ${selectedCourier.name}` : 'Select a courier to assign'}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedCourier}
            >
              Assign Courier
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
