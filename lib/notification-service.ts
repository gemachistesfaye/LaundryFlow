// Mock notification service for WebSocket-like functionality
// In production, replace with actual WebSocket connection

type NotificationListener = (notification: any) => void

class NotificationService {
  private listeners: Map<string, Set<NotificationListener>> = new Map()

  subscribe(userId: string, callback: NotificationListener) {
    if (!this.listeners.has(userId)) {
      this.listeners.set(userId, new Set())
    }
    this.listeners.get(userId)?.add(callback)
    return () => this.unsubscribe(userId, callback)
  }

  unsubscribe(userId: string, callback: NotificationListener) {
    this.listeners.get(userId)?.delete(callback)
  }

  notify(userId: string, notification: any) {
    this.listeners.get(userId)?.forEach((callback) => callback(notification))
  }

  // Simulate real-time notifications
  simulateNotifications() {
    const notifications = [
      { type: "order_approved", title: "Order Approved", message: "Your order has been approved" },
      { type: "worker_assigned", title: "Worker Assigned", message: "A worker has been assigned to your order" },
      { type: "order_ready", title: "Order Ready", message: "Your order is ready for delivery" },
      { type: "delivered", title: "Delivered", message: "Your order has been delivered" },
    ]

    setInterval(() => {
      const randomNotif = notifications[Math.floor(Math.random() * notifications.length)]
      this.listeners.forEach((callbacks) => {
        callbacks.forEach((cb) => cb(randomNotif))
      })
    }, 30000) // Simulate notification every 30 seconds
  }
}

export const notificationService = new NotificationService()
