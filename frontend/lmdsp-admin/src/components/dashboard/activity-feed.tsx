import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Truck, CheckCircle, AlertCircle, MapPin } from 'lucide-react'

interface Activity {
  order_id: string
  status: string
  courier: string
  eta: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (status: string) => {
    switch (status) {
      case 'created':
        return <Package className="h-4 w-4 text-blue-500" />
      case 'assigned':
        return <Truck className="h-4 w-4 text-orange-500" />
      case 'picked_up':
        return <MapPin className="h-4 w-4 text-purple-500" />
      case 'in_transit':
        return <Truck className="h-4 w-4 text-yellow-500" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-800'
      case 'assigned':
        return 'bg-orange-100 text-orange-800'
      case 'picked_up':
        return 'bg-purple-100 text-purple-800'
      case 'in_transit':
        return 'bg-yellow-100 text-yellow-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const formatTime = (eta: string) => {
    const now = new Date()
    const etaTime = new Date(eta)
    const diffMinutes = Math.floor((etaTime.getTime() - now.getTime()) / (1000 * 60))
    
    if (diffMinutes <= 0) return 'Due now'
    if (diffMinutes < 60) return `Due in ${diffMinutes}min`
    if (diffMinutes < 1440) return `Due in ${Math.floor(diffMinutes / 60)}h`
    return `Due in ${Math.floor(diffMinutes / 1440)}d`
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No recent activity</p>
        <p className="text-sm">Activity will appear here in real-time</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="flex-shrink-0 mt-1">
            {getActivityIcon(activity.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">
                Order #{activity.order_id.slice(-8)}
              </p>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)}`}>
                {formatStatus(activity.status)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Courier: <span className="font-medium">{activity.courier}</span>
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {formatTime(activity.eta)}
              </span>
              <span className="text-xs text-gray-400">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
