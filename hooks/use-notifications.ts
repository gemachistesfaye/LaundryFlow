"use client"

import { useEffect, useState, useCallback } from "react"
import { notificationService } from "@/lib/notification-service"

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(userId, (newNotif) => {
      const notification: Notification = {
        id: `${Date.now()}-${Math.random()}`,
        ...newNotif,
        timestamp: new Date(),
        read: false,
      }

      setNotifications((prev) => [notification, ...prev.slice(0, 49)])
      setUnreadCount((prev) => prev + 1)

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
      }, 5000)
    })

    return unsubscribe
  }, [userId])

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
  }
}
