"use client"

import { Bell, AlertCircle, CheckCircle, Clock } from "lucide-react"

export function NotificationsPanel() {
  const notifications = [
    {
      id: 1,
      type: "info",
      title: "New order submitted",
      message: "John Doe submitted a new laundry order",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "alert",
      title: "Worker not confirmed",
      message: "Worker assignment expires in 30 minutes if not confirmed",
      time: "30 minutes ago",
    },
    {
      id: 3,
      type: "success",
      title: "Order completed",
      message: "Order #1234 was successfully delivered",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "info",
      title: "Payment proof received",
      message: "Jane Smith uploaded payment proof for order #5678",
      time: "3 hours ago",
    },
  ]

  const getIcon = (type) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "info":
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="space-y-3">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="flex gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex-shrink-0 mt-1">{getIcon(notif.type)}</div>

          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{notif.title}</h4>

            <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>

            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {notif.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
