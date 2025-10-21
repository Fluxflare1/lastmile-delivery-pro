'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, MapPin, Edit, Trash2, Search, Filter, Users, Package } from 'lucide-react'

interface ServiceArea {
  id: string
  name: string
  type: 'premium' | 'standard' | 'outstation'
  coverage: string
  couriers_assigned: number
  daily_capacity: number
  status: 'active' | 'inactive'
}

interface ServiceAreaManagementProps {
  serviceAreas: ServiceArea[]
  overview: any
}

export default function ServiceAreaManagement({ serviceAreas, overview }: ServiceAreaManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredAreas = serviceAreas.filter(area => {
    const matchesSearch = area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.coverage.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || area.type === filterType
    return matchesSearch && matchesType
  })

  const getTypeBadge = (type: string) => {
    const config = {
      premium: { label: 'Premium', color: 'bg-purple-100 text-purple-800' },
      standard: { label: 'Standard', color: 'bg-blue-100 text-blue-800' },
      outstation: { label: 'Outstation', color: 'bg-green-100 text-green-800' }
    }[type] || { label: type, color: 'bg-gray-100 text-gray-800' }

    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'Active', color: 'bg-green-100 text-green-800' },
      inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800' }
    }[status] || { label: status, color: 'bg-gray-100 text-gray-800' }

    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Service Area Management</CardTitle>
              <CardDescription>
                Manage delivery zones and coverage areas for {overview?.active_zones} active zones
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service Area
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search service areas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="premium">Premium</option>
              <option value="standard">Standard</option>
              <option value="outstation">Outstation</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Service Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAreas.map((area) => (
          <Card key={area.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{area.name}</CardTitle>
                    {getTypeBadge(area.type)}
                  </div>
                </div>
                {getStatusBadge(area.status)}
              </div>
              <CardDescription className="mt-2">
                {area.coverage}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Couriers Assigned</span>
                  </div>
                  <span className="font-medium">{area.couriers_assigned}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Daily Capacity</span>
                  </div>
                  <span className="font-medium">{area.daily_capacity} deliveries</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Utilization</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (area.daily_capacity / 150) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round((area.daily_capacity / 150) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coverage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Coverage Statistics</CardTitle>
          <CardDescription>
            Service area performance and capacity metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {serviceAreas.length}
              </div>
              <div className="text-sm text-gray-600">Total Areas</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {serviceAreas.filter(a => a.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Areas</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {serviceAreas.reduce((acc, area) => acc + area.couriers_assigned, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Couriers</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {serviceAreas.reduce((acc, area) => acc + area.daily_capacity, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Daily Capacity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Service Area Modal would go here */}
    </div>
  )
}
