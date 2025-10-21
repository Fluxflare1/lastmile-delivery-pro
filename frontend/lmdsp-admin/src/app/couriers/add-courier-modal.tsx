'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, User, Phone, Mail, MapPin, Car } from 'lucide-react'

interface AddCourierModalProps {
  onClose: () => void
  onSubmit: (courierData: any) => Promise<any>
}

export default function AddCourierModal({ onClose, onSubmit }: AddCourierModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle_type: 'bike',
    vehicle_details: {
      make: '',
      model: '',
      year: '',
      plate_number: '',
      color: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      country: 'Nigeria'
    },
    documents: {
      license_number: '',
      license_expiry: '',
      insurance_number: '',
      insurance_expiry: ''
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone) {
        alert('Please fill in all required fields')
        return
      }

      await onSubmit(formData)
    } catch (error) {
      console.error('Courier creation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVehicleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      vehicle_details: {
        ...prev.vehicle_details,
        [field]: value
      }
    }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }))
  }

  const handleDocumentChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: value
      }
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold">Add New Courier</h2>
            <p className="text-sm text-gray-600">Register a new courier to your delivery team</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Courier"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+2348012345678"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type *
                  </label>
                  <select
                    value={formData.vehicle_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicle_type: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  >
                    <option value="bike">Motorcycle</option>
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="truck">Truck</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Car className="h-5 w-5 mr-2 text-green-500" />
                Vehicle Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Make
                  </label>
                  <Input
                    value={formData.vehicle_details.make}
                    onChange={(e) => handleVehicleChange('make', e.target.value)}
                    placeholder="Toyota"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <Input
                    value={formData.vehicle_details.model}
                    onChange={(e) => handleVehicleChange('model', e.target.value)}
                    placeholder="Corolla"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <Input
                    value={formData.vehicle_details.year}
                    onChange={(e) => handleVehicleChange('year', e.target.value)}
                    placeholder="2020"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plate Number
                  </label>
                  <Input
                    value={formData.vehicle_details.plate_number}
                    onChange={(e) => handleVehicleChange('plate_number', e.target.value)}
                    placeholder="ABC123XY"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <Input
                    value={formData.vehicle_details.color}
                    onChange={(e) => handleVehicleChange('color', e.target.value)}
                    placeholder="Red"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-purple-500" />
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <Input
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Input
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    placeholder="Lagos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <Input
                    value={formData.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    placeholder="Lagos"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-lg font-medium mb-4">Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver's License Number
                  </label>
                  <Input
                    value={formData.documents.license_number}
                    onChange={(e) => handleDocumentChange('license_number', e.target.value)}
                    placeholder="DL123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Expiry Date
                  </label>
                  <Input
                    type="date"
                    value={formData.documents.license_expiry}
                    onChange={(e) => handleDocumentChange('license_expiry', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Number
                  </label>
                  <Input
                    value={formData.documents.insurance_number}
                    onChange={(e) => handleDocumentChange('insurance_number', e.target.value)}
                    placeholder="INS987654321"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Expiry Date
                  </label>
                  <Input
                    type="date"
                    value={formData.documents.insurance_expiry}
                    onChange={(e) => handleDocumentChange('insurance_expiry', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding Courier...' : 'Add Courier'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
