import { getOrderStatusColor } from '@/lib/utils'

interface OrderStatusBadgeProps {
  status: string
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-800' },
    picked_up: { label: 'Picked Up', color: 'bg-purple-100 text-purple-800' },
    in_transit: { label: 'In Transit', color: 'bg-orange-100 text-orange-800' },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  }

  const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}
