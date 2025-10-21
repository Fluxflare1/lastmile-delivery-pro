'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Truck, 
  DollarSign, 
  BarChart3, 
  Settings,
  MapPin,
  MessageSquare,
  Smartphone
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    current: true
  },
  {
    name: 'Order Management',
    href: '/orders',
    icon: Package,
    current: false
  },
  {
    name: 'Courier Management',
    href: '/couriers',
    icon: Users,
    current: false
  },
  {
    name: 'Fleet Management',
    href: '/fleet',
    icon: Truck,
    current: false
  },
  {
    name: 'Customer Management',
    href: '/customers',
    icon: Users,
    current: false
  },
  {
    name: 'Financial Management',
    href: '/financial',
    icon: DollarSign,
    current: false
  },
  {
    name: 'Operations',
    href: '/operations',
    icon: MapPin,
    current: false
  },
  {
    name: 'Analytics & Reports',
    href: '/analytics',
    icon: BarChart3,
    current: false
  },
  {
    name: 'Communications',
    href: '/communications',
    icon: MessageSquare,
    current: false
  },
  {
    name: 'Mobile Apps',
    href: '/mobile-apps',
    icon: Smartphone,
    current: false
  },
  {
    name: 'System Configuration',
    href: '/settings',
    icon: Settings,
    current: false
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LD</span>
            </div>
            <div>
              <div className="font-bold text-gray-900">LMDSP Admin</div>
              <div className="text-xs text-gray-500">Last-Mile Delivery</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">LD</span>
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 hidden md:block"
        >
          <div className={cn(
            "w-4 h-4 border-l-2 border-t-2 border-gray-400 transform transition-transform",
            collapsed ? "rotate-45" : "-rotate-135"
          )} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats - Only show when not collapsed */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 mt-4">
          <div className="text-xs font-medium text-gray-500 mb-2">QUICK STATS</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Orders</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Available Couriers</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Today's Revenue</span>
              <span className="font-medium text-green-600">₦45,200</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
