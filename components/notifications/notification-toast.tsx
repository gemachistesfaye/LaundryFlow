"use client"

import { useEffect } from "react"
import { X, Bell, CheckCircle, AlertCircle, Truck } from "lucide-react"

interface NotificationToastProps {
  notification: any
  onClose: () => void
}

export function NotificationToast({ notification, onClose }: NotificationToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = (type: string) => {
    switch (type) {
      case "order_approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "worker_assigned":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case "order_ready":
        return <Bell className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <Truck className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-primary" />
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm animate-in fade-in slide-in-from-bottom-4 z-50 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground">{notification.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
        </div>
        <button onClick={onClose} className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
