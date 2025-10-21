interface CourierStatusBadgeProps {
  status: string
}

export default function CourierStatusBadge({ status }: CourierStatusBadgeProps) {
  const statusConfig: Record<string, { label: string; color: string; dotColor: string }> = {
    available: { 
      label: 'Available', 
      color: 'bg-green-100 text-green-800',
      dotColor: 'bg-green-400'
    },
    busy: { 
      label: 'On Delivery', 
      color: 'bg-orange-100 text-orange-800',
      dotColor: 'bg-orange-400'
    },
    offline: { 
      label: 'Offline', 
      color: 'bg-gray-100 text-gray-800',
      dotColor: 'bg-gray-400'
    }
  }

  const config = statusConfig[status] || { 
    label: status, 
    color: 'bg-gray-100 text-gray-800',
    dotColor: 'bg-gray-400'
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <span className={`w-2 h-2 rounded-full ${config.dotColor} mr-1`}></span>
      {config.label}
    </span>
  )
}
