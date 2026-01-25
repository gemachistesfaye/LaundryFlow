"use client"

import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

// Simple client-side notifications hook
function useNotifications(userId) {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(`notifications_${userId}`)
    return saved ? JSON.parse(saved) : []
  })
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id) => {
    const updated = notifications.map((n) => n.id === id ? { ...n, read: true } : n)
    setNotifications(updated)
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated))
  }

  const clearAll = () => {
    const cleared = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(cleared)
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(cleared))
  }

  return { notifications, unreadCount, markAsRead, clearAll }
}

export function NotificationPanel({ userId, isOpen, onClose }) {
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications(userId || "1")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">{unreadCount}</span>
            )}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Bell className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${notif.read ? "" : "bg-primary/5"}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {!notif.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm">{notif.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 break-words">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-border p-4">
            <Button variant="outline" className="w-full text-sm bg-transparent" onClick={clearAll}>
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
