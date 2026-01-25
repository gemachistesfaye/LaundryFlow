"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Download, Bell, Volume, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [orders, setOrders] = useState([
    { id: "#1001", student: "John Doe", items: 3, total: 15, status: "completed", date: "2024-02-20" },
    { id: "#1002", student: "Jane Smith", items: 2, total: 10, status: "in_progress", date: "2024-02-21" },
    { id: "#1003", student: "Mike Johnson", items: 1, total: 5, status: "pending", date: "2024-02-21" },
    { id: "#1004", student: "Sarah Lee", items: 4, total: 20, status: "completed", date: "2024-02-19" },
    { id: "#1005", student: "Tom Wilson", items: 2, total: 10, status: "cancelled", date: "2024-02-18" },
  ])
  const [notifications, setNotifications] = useState([])
  const [highlightedOrders, setHighlightedOrders] = useState([])
  const [soundEnabled, setSoundEnabled] = useState(true)

  const audioRef = useRef(null)

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      in_progress: "bg-blue-100 text-blue-800 border-blue-300",
      completed: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    }
    return colors[status] || colors.pending
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.student.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Example: simulate a new order arriving after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const newOrder = { id: "#1006", student: "New Student", items: 2, total: 10, status: "pending", date: "2024-02-22" }
      setOrders((prev) => [newOrder, ...prev])
      setHighlightedOrders((prev) => [...prev, newOrder.id])
      setNotifications((prev) => [{ id: newOrder.id, message: `New order from ${newOrder.student}` }, ...prev])

      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch((err) => console.error("Audio play error:", err))
      }

      setTimeout(() => setHighlightedOrders((prev) => prev.filter((id) => id !== newOrder.id)), 5000)
      setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== newOrder.id)), 5000)
    }, 5000)

    return () => clearTimeout(timer)
  }, [soundEnabled])

  return (
    <div className="space-y-4 relative">
      <audio ref={audioRef} src="/notification-sound.mp3" preload="auto" />

      {/* Notifications */}
      <div className="fixed top-5 right-5 space-y-2 z-50">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow-md"
          >
            <Bell className="h-4 w-4" />
            <span>{notif.message}</span>
            <button
              className="ml-2 font-bold"
              onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Search, Export & Sound Toggle */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="md:w-auto bg-transparent flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button
          variant="outline"
          className="md:w-auto bg-transparent flex items-center gap-2"
          onClick={() => setSoundEnabled((prev) => !prev)}
        >
          {soundEnabled ? <Volume className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {soundEnabled ? "Sound On" : "Sound Off"}
        </Button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No orders found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Order ID</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Student</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Items</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Total</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={`${idx !== filteredOrders.length - 1 ? "border-b border-border" : ""} ${
                    highlightedOrders.includes(order.id) ? "bg-yellow-100 animate-pulse" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono font-semibold text-foreground">{order.id}</td>
                  <td className="px-4 py-3 text-foreground">{order.student}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.items} bags</td>
                  <td className="px-4 py-3 font-semibold text-foreground">${order.total}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
