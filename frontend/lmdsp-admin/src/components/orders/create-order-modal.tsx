'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, MapPin, User, Phone } from 'lucide-react'

interface CreateOrderModalProps {
  onClose: () => void
  onSubmit: (orderData: any) => Promise<any>
}

export default function CreateOrderModal({ onClose, onSubmit }: CreateOrderModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    service_type: 'on_demand',
    pickup_address: {
      street: '',
      city: '',
      state: '',
      country: 'Nigeria',
      contact_name: '',
      contact_phone: ''
    },
    delivery_address: {
      street: '',
      city: '',
      state: '',
      country: 'Nigeria', 
      contact_name: '',
      contact_phone: ''
    },
    parcel_details: {
      weight_kg: '',
      dimensions: '',
      description: '',
      category: 'parcel'
    },
    delivery_instructions: '',
    insurance_required: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Validate required fields
      if (!formData.pickup_address.contact_name || !formData.delivery_address.contact_name) {
        alert('Please fill in all required fields')
        return
      }

      const orderData = {
        ...formData,
        parcel_details: {
          ...formData.parcel_details,
          weight_kg: parseFloat(formData.parcel_details.weight_kg) || 1
        }
      }

      await onSubmit(orderData)
    } catch (error) {
      console.error('Order creation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddressChange = (type: 'pickup' | 'delivery', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [`${type}_address`]: {
        ...prev[`${type}_address`],
        [field]: value
      }
    }))
  }

  const handleParcelChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      parcel_details: {
        ...prev.parcel_details,
        [field]: value
      }
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold">Create New Order</h2>
            <p className="text-sm text-gray-600">Manual order creation for immediate processing</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    formData.service_type === 'on_demand'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, service_type: 'on_demand' }))}
                >
                  <div className="font-medium">On-Demand Delivery</div>
                  <div className="text-sm text-gray-600">Same-day intra-city delivery</div>
                </button>
                <button
                  type="button"
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    formData.service_type === 'outstation'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, service_type: 'outstation' }))}
                >
                  <div className="font-medium">Outstation Delivery</div>
                  <div className="text-sm text-gray-600">Inter-city or inter-state delivery</div>
                </button>
              </div>
            </div>

            {/* Pickup Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  Pickup Address
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <Input
                    value={formData.pickup_address.contact_name}
                    onChange={(e) => handleAddressChange('pickup', 'contact_name', e.target.value)}
                    placeholder="Sender name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <Input
                    value={formData.pickup_address.contact_phone}
                    onChange={(e) => handleAddressChange('pickup', 'contact_phone', e.target.value)}
                    placeholder="+2348012345678"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <Input
                      value={formData.pickup_address.city}
                      onChange={(e) => handleAddressChange('pickup', 'city', e.target.value)}
                      placeholder="Lagos"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <Input
                      value={formData.pickup_address.state}
                      onChange={(e) => handleAddressChange('pickup', 'state', e.target.value)}
                      placeholder="Lagos"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <Input
                    value={formData.pickup_address.street}
                    onChange={(e) => handleAddressChange('pickup', 'street', e.target.value)}
                    placeholder="123 Main Street, Victoria Island"
                    required
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-500" />
                  Delivery Address
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <Input
                    value={formData.delivery_address.contact_name}
                    onChange={(e) => handleAddressChange('delivery', 'contact_name', e.target.value)}
                    placeholder="Recipient name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <Input
                    value={formData.delivery_address.contact_phone}
                    onChange={(e) => handleAddressChange('delivery', 'contact_phone', e.target.value)}
                    placeholder="+2348098765432"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <Input
                      value={formData.delivery_address.city}
                      onChange={(e) => handleAddressChange('delivery', 'city', e.target.value)}
                      placeholder="Abuja"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <Input
                      value={formData.delivery_address.state}
                      onChange={(e) => handleAddressChange('delivery', 'state', e.target.value)}
                      placeholder="FCT"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <Input
                    value={formData.delivery_address.street}
                    onChange={(e) => handleAddressChange('delivery', 'street', e.target.value)}
                    placeholder="456 Delivery Avenue, Maitama"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Parcel Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Parcel Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg) *
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.parcel_details.weight_kg}
                    onChange={(e) => handleParcelChange('weight_kg', e.target.value)}
                    placeholder="2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions
                  </label>
                  <Input
                    value={formData.parcel_details.dimensions}
                    onChange={(e) => handleParcelChange('dimensions', e.target.value)}
                    placeholder="10x10x5 cm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.parcel_details.category}
                    onChange={(e) => handleParcelChange('category', e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="document">Document</option>
                    <option value="parcel">Parcel</option>
                    <option value="fragile">Fragile</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Input
                  value={formData.parcel_details.description}
                  onChange={(e) => handleParcelChange('description', e.target.value)}
                  placeholder="Brief description of the package contents"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Instructions
              </label>
              <textarea
                value={formData.delivery_instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, delivery_instructions: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Special instructions for the courier..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Order...' : 'Create Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
