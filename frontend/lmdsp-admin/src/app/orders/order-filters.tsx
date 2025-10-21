'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'
import { useState } from 'react'

interface OrderFiltersProps {
  filters: {
    status: string
    service_type: string
    date_range: string
    search: string
  }
  onFiltersChange: (filters: any) => void
  orderCount: number
}

export default function OrderFilters({ filters, onFiltersChange, orderCount }: OrderFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      status: '',
      service_type: '',
      date_range: '',
      search: ''
    })
  }

  const hasActiveFilters = filters.status || filters.service_type || filters.date_range || filters.search

  return (
    <div className="space-y-4">
      {/* Basic Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by tracking number, customer name..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={showAdvanced ? "default" : "outline"}
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <select
              value={filters.service_type}
              onChange={(e) => handleFilterChange('service_type', e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Services</option>
              <option value="on_demand">On-Demand</option>
              <option value="outstation">Outstation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={filters.date_range}
              onChange={(e) => handleFilterChange('date_range', e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this_week">This Week</option>
              <option value="last_week">Last Week</option>
              <option value="this_month">This Month</option>
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">{orderCount} orders match your filters:</span>
          {filters.status && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              Status: {filters.status}
            </span>
          )}
          {filters.service_type && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              Service: {filters.service_type}
            </span>
          )}
          {filters.date_range && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
              Date: {filters.date_range}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
