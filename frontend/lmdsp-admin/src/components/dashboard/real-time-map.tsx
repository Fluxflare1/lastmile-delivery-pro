'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'

export default function RealTimeMap() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading operations map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-gray-200 relative overflow-hidden">
      {/* Mock Map Interface */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200">
        {/* Mock city grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 gap-4 h-full p-4">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-blue-300 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Mock courier markers */}
        <div className="absolute top-1/4 left-1/4">
          <div className="relative">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute -top-8 -left-4 bg-white px-2 py-1 rounded text-xs font-medium shadow-sm">
              Courier #001
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-1/3">
          <div className="relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute -top-8 -left-4 bg-white px-2 py-1 rounded text-xs font-medium shadow-sm">
              Courier #002
            </div>
          </div>
        </div>
        
        <div className="absolute top-3/4 left-2/3">
          <div className="relative">
            <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute -top-8 -left-4 bg-white px-2 py-1 rounded text-xs font-medium shadow-sm">
              Courier #003
            </div>
          </div>
        </div>

        {/* Mock delivery routes */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2">
          <svg className="w-full h-full">
            <path
              d="M0,0 L100,100 L200,50"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button className="bg-white p-2 rounded-lg shadow-sm hover:bg-gray-50">
          <span className="text-sm font-medium">➕</span>
        </button>
        <button className="bg-white p-2 rounded-lg shadow-sm hover:bg-gray-50">
          <span className="text-sm font-medium">➖</span>
        </button>
        <button className="bg-white p-2 rounded-lg shadow-sm hover:bg-gray-50">
          <span className="text-sm font-medium">📍</span>
        </button>
      </div>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-sm">
        <div className="text-sm font-medium mb-2">Live Couriers</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>On Delivery</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span>Returning</span>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
        <div className="flex justify-between">
          <span>🟢 8 couriers active</span>
          <span>📦 12 deliveries in progress</span>
          <span>🕒 Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
