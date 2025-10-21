'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { apiClient } from '@/lib/api'
import MainLayout from '@/components/layout/main-layout'
import CustomerList from '@/components/customers/customer-list'
import CustomerFilters from '@/components/customers/customer-filters'
import CustomerProfileModal from '@/components/customers/customer-profile-modal'
import ServiceQualityMetrics from '@/components/customers/service-quality-metrics'
import FeedbackAnalysis from '@/components/customers/feedback-analysis'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Star, MessageSquare, TrendingUp, Download } from 'lucide-react'

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

export default function CustomersPage() {
  const { user, tenant } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [filters, setFilters] = useState({
    status: '',
    segment: '',
    search: ''
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [customers, filters])

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      // Mock data - in real app, this would come from API
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+2348012345678',
          total_orders: 15,
          total_spent: 45000,
          last_order_date: '2024-01-15T10:30:00Z',
          customer_since: '2023-06-15T00:00:00Z',
          status: 'active',
          segment: 'regular',
          satisfaction_score: 4.8
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          phone: '+2348098765432',
          total_orders: 8,
          total_spent: 28000,
          last_order_date: '2024-01-14T14:20:00Z',
          customer_since: '2023-09-20T00:00:00Z',
          status: 'active',
          segment: 'premium',
          satisfaction_score: 4.9
        },
        {
          id: '3',
          name: 'Mike Davis',
          email: 'mike.davis@example.com',
          phone: '+2348055512345',
          total_orders: 3,
          total_spent: 8500,
          last_order_date: '2024-01-12T16:45:00Z',
          customer_since: '2024-01-01T00:00:00Z',
          status: 'new',
          segment: 'new',
          satisfaction_score: 4.5
        },
        {
          id: '4',
          name: 'Lisa Brown',
          email: 'lisa.b@example.com',
          phone: '+2348077788999',
          total_orders: 22,
          total_spent: 72000,
          last_order_date: '2024-01-10T11:15:00Z',
          customer_since: '2023-03-10T00:00:00Z',
          status: 'active',
          segment: 'premium',
          satisfaction_score: 4.7
        }
      ]
      setCustomers(mockCustomers)
      setError('')
    } catch (err: any) {
      setError('Failed to load customers')
      console.error('Customers fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...customers]

    if (filters.status) {
      filtered = filtered.filter(customer => customer.status === filters.status)
    }

    if (filters.segment) {
      filtered = filtered.filter(customer => customer.segment === filters.segment)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone.includes(searchLower)
      )
    }

    setFilteredCustomers(filtered)
  }

  const getStats = () => {
    const total = customers.length
    const active = customers.filter(c => c.status === 'active').length
    const premium = customers.filter(c => c.segment === 'premium').length
    const avgSatisfaction = customers.reduce((acc, curr) => acc + curr.satisfaction_score, 0) / total
    
    return { total, active, premium, avgSatisfaction: avgSatisfaction || 0 }
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
            <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-600 mt-2">
              Manage customer relationships and service quality for {tenant?.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
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
                  <div className="text-sm text-gray-600">Total Customers</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                  <div className="text-sm text-gray-600">Active Customers</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.premium}</div>
                  <div className="text-sm text-gray-600">Premium Customers</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.avgSatisfaction.toFixed(1)}/5
                  </div>
                  <div className="text-sm text-gray-600">Avg Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Quality Metrics */}
        <ServiceQualityMetrics />

        {/* Feedback Analysis */}
        <FeedbackAnalysis />

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Filters</CardTitle>
            <CardDescription>
              Filter and search through your customer database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerFilters
              filters={filters}
              onFiltersChange={setFilters}
              customerCount={filteredCustomers.length}
            />
          </CardContent>
        </Card>

        {/* Customers List */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Database</CardTitle>
            <CardDescription>
              {filteredCustomers.length} customers found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <div className="text-red-500 text-xl mb-2">⚠️</div>
                <p className="text-gray-600">{error}</p>
                <Button onClick={fetchCustomers} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : (
              <CustomerList
                customers={filteredCustomers}
                onViewProfile={setSelectedCustomer}
              />
            )}
          </CardContent>
        </Card>

        {/* Customer Profile Modal */}
        {selectedCustomer && (
          <CustomerProfileModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </div>
    </MainLayout>
  )
}
