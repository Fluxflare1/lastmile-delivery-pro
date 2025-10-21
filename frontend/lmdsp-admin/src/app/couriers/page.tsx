'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { apiClient } from '@/lib/api'
import MainLayout from '@/components/layout/main-layout'
import CourierList from '@/components/couriers/courier-list'
import CourierFilters from '@/components/couriers/courier-filters'
import CourierProfileModal from '@/components/couriers/courier-profile-modal'
import AddCourierModal from '@/components/couriers/add-courier-modal'
import PerformanceMetrics from '@/components/couriers/performance-metrics'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Users, TrendingUp, Clock, Award, MapPin } from 'lucide-react'
import { Courier } from '@/types'

export default function CouriersPage() {
  const { user, tenant } = useAuth()
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [filteredCouriers, setFilteredCouriers] = useState<Courier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    vehicle_type: '',
    search: ''
  })

  useEffect(() => {
    fetchCouriers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [couriers, filters])

  const fetchCouriers = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.getCouriers()
      setCouriers(data.couriers || [])
      setError('')
    } catch (err: any) {
      setError('Failed to load couriers')
      console.error('Couriers fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...couriers]

    if (filters.status) {
      filtered = filtered.filter(courier => courier.status === filters.status)
    }

    if (filters.vehicle_type) {
      filtered = filtered.filter(courier => courier.vehicle_type === filters.vehicle_type)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(courier => 
        courier.name.toLowerCase().includes(searchLower) ||
        courier.email.toLowerCase().includes(searchLower) ||
        courier.phone.includes(searchLower)
      )
    }

    setFilteredCouriers(filtered)
  }

  const handleAddCourier = async (courierData: any) => {
    try {
      // In a real app, this would call the API
      const newCourier: Courier = {
        id: `courier-${Date.now()}`,
        ...courierData,
        status: 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setCouriers(prev => [newCourier, ...prev])
      setShowAddModal(false)
      return newCourier
    } catch (error) {
      throw error
    }
  }

  const handleStatusUpdate = (courierId: string, newStatus: string) => {
    setCouriers(prev => prev.map(courier => 
      courier.id === courierId ? { ...courier, status: newStatus as any } : courier
    ))
  }

  const getStats = () => {
    const total = couriers.length
    const available = couriers.filter(c => c.status === 'available').length
    const busy = couriers.filter(c => c.status === 'busy').length
    const offline = couriers.filter(c => c.status === 'offline').length
    
    return { total, available, busy, offline }
  }

  const stats = getStats()

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
            <h1 className="text-3xl font-bold text-gray-900">Courier Management</h1>
            <p className="text-gray-600 mt-2">
              Manage your delivery team and track performance for {tenant?.name}
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Courier
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Couriers</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{stats.busy}</div>
                  <div className="text-sm text-gray-600">On Delivery</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg mr-3">
                  <Award className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">4.8/5</div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <PerformanceMetrics couriers={couriers} />

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Courier Filters</CardTitle>
            <CardDescription>
              Filter and search through your courier team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CourierFilters
              filters={filters}
              onFiltersChange={setFilters}
              courierCount={filteredCouriers.length}
            />
          </CardContent>
        </Card>

        {/* Couriers List */}
        <Card>
          <CardHeader>
            <CardTitle>Courier Team</CardTitle>
            <CardDescription>
              {filteredCouriers.length} couriers found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <div className="text-red-500 text-xl mb-2">⚠️</div>
                <p className="text-gray-600">{error}</p>
                <Button onClick={fetchCouriers} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : (
              <CourierList
                couriers={filteredCouriers}
                onStatusUpdate={handleStatusUpdate}
                onViewProfile={setSelectedCourier}
              />
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        {showAddModal && (
          <AddCourierModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddCourier}
          />
        )}

        {selectedCourier && (
          <CourierProfileModal
            courier={selectedCourier}
            onClose={() => setSelectedCourier(null)}
            onUpdate={(updatedCourier) => {
              setCouriers(prev => prev.map(c => 
                c.id === updatedCourier.id ? updatedCourier : c
              ))
              setSelectedCourier(null)
            }}
          />
        )}
      </div>
    </MainLayout>
  )
}
