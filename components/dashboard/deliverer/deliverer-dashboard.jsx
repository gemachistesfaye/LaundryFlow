"use client"

import { useState, useEffect } from "react"
import { Truck, MapPin, CheckCircle, Clock } from "lucide-react"
import { DeliveryTasksList } from "./delivery-tasks-list"

export function DelivererDashboard({ user }) {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const fetchDeliveries = async () => {
    setLoading(true)
    try {
      // Mock data
      const allDeliveries = [
        {
          id: "1",
          studentName: "John Doe",
          building: "Building A",
          room: "201",
          status: "ready_for_delivery",
          quantity: 3,
          destination: "Student Dorm A, Room 201",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          assignedTo: "deliverer1@smartwash.edu",
        },
        {
          id: "2",
          studentName: "Jane Smith",
          building: "Building B",
          room: "305",
          status: "in_delivery",
          quantity: 2,
          destination: "Student Dorm B, Room 305",
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          assignedTo: "deliverer2@smartwash.edu",
        },
        {
          id: "3",
          studentName: "Mike Johnson",
          building: "Building A",
          room: "101",
          status: "completed",
          quantity: 1,
          destination: "Student Dorm A, Room 101",
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
          assignedTo: "deliverer1@smartwash.edu",
        },
      ]

      // Filter deliveries assigned to the current deliverer
      const userDeliveries = allDeliveries.filter(d => d.assignedTo === user.email)

      setDeliveries(userDeliveries)
    } catch (err) {
      console.error("Failed to fetch deliveries:", err)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    pending: deliveries.filter(d => d.status === "ready_for_delivery").length,
    inProgress: deliveries.filter(d => d.status === "in_delivery").length,
    completed: deliveries.filter(d => d.status === "completed").length,
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Pending Delivery</div>
              <div className="text-3xl font-bold text-foreground">{stats.pending}</div>
            </div>
            <MapPin className="h-8 w-8 text-yellow-500 opacity-50" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">In Route</div>
              <div className="text-3xl font-bold text-foreground">{stats.inProgress}</div>
            </div>
            <Truck className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Completed (Today)</div>
              <div className="text-3xl font-bold text-foreground">{stats.completed}</div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Your Rating</div>
              <div className="text-3xl font-bold text-foreground">4.9</div>
            </div>
            <Clock className="h-8 w-8 text-primary opacity-50" />
          </div>
        </div>
      </div>

      {/* Delivery Tasks */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Delivery Tasks</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Loading deliveries...</div>
        ) : deliveries.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No deliveries assigned to you</div>
        ) : (
          <DeliveryTasksList deliveries={deliveries} onDeliveriesUpdated={fetchDeliveries} />
        )}
      </div>
    </main>
  )
}
