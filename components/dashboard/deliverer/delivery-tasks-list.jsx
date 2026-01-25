"use client"
import { useState, useRef } from "react"
import { CheckCircle, Navigation, UserCheck, UserX, Package, Bell, Volume, VolumeX, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DeliveryTasksList({ deliveries, onDeliveriesUpdated }) {
  const [notifications, setNotifications] = useState([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [modal, setModal] = useState({ open: false, delivery: null, action: "" })
  const [filter, setFilter] = useState("all")
  const audioRef = useRef(null)

  const getStatusBadge = (status) => {
    switch (status) {
      case "ready_for_delivery":
        return { bg: "bg-yellow-100 text-yellow-800 border-yellow-300", label: "Ready for Pickup" }
      case "in_delivery":
        return { bg: "bg-blue-100 text-blue-800 border-blue-300", label: "In Route" }
      case "with_worker":
        return { bg: "bg-purple-100 text-purple-800 border-purple-300", label: "With Worker" }
      case "completed":
        return { bg: "bg-green-100 text-green-800 border-green-300", label: "Delivered" }
      case "rejected":
        return { bg: "bg-red-100 text-red-800 border-red-300", label: "Rejected" }
      case "busy":
        return { bg: "bg-gray-100 text-gray-800 border-gray-300", label: "Busy" }
      default:
        return { bg: "bg-gray-100 text-gray-800 border-gray-300", label: status }
    }
  }

  const filteredDeliveries = filter === "all" ? deliveries : deliveries.filter((d) => d.status === filter)

  const handleUpdateStatus = (delivery, newStatus) => {
    delivery.status = newStatus
    onDeliveriesUpdated()
    showNotification(delivery, newStatus)
  }

  const showNotification = (delivery, newStatus) => {
    const id = crypto.randomUUID() // unique ID
    const notif = { id, message: `Delivery ${delivery.studentName}: ${newStatus.replace("_", " ")}` }
    setNotifications((prev) => [notif, ...prev])

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000)

    if (soundEnabled && audioRef.current) audioRef.current.play().catch(() => {})
  }

  const openModal = (delivery, action) => setModal({ open: true, delivery, action })
  const closeModal = () => setModal({ open: false, delivery: null, action: "" })
  const confirmAction = () => {
    if (modal.delivery && modal.action) handleUpdateStatus(modal.delivery, modal.action)
    closeModal()
  }

  return (
    <div className="relative">
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

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <select className="border px-2 py-1 rounded" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="ready_for_delivery">Ready for Pickup</option>
            <option value="in_delivery">In Route</option>
            <option value="with_worker">With Worker</option>
            <option value="completed">Delivered</option>
            <option value="rejected">Rejected</option>
            <option value="busy">Busy</option>
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setSoundEnabled((prev) => !prev)}
        >
          {soundEnabled ? <Volume className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {soundEnabled ? "Sound On" : "Sound Off"}
        </Button>
      </div>

      {/* Delivery List */}
      <div className="divide-y divide-border">
        {filteredDeliveries.map((delivery) => {
          const statusInfo = getStatusBadge(delivery.status)
          return (
            <div key={delivery.id} className="p-6 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{delivery.studentName}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Destination</p>
                      <p className="font-medium text-foreground">{delivery.destination}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-medium text-foreground">{delivery.quantity} bag(s)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ready Since</p>
                      <p className="font-medium text-foreground">{new Date(delivery.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                  {delivery.status === "ready_for_delivery" && (
                    <>
                      <Button onClick={() => openModal(delivery, "in_delivery")}>
                        <Navigation className="h-4 w-4 mr-2" />Accept
                      </Button>
                      <Button onClick={() => openModal(delivery, "rejected")} variant="destructive">
                        <UserX className="h-4 w-4 mr-2" />Reject
                      </Button>
                      <Button onClick={() => openModal(delivery, "busy")} variant="outline">
                        <Package className="h-4 w-4 mr-2" />Busy
                      </Button>
                    </>
                  )}
                  {delivery.status === "in_delivery" && (
                    <>
                      <Button onClick={() => openModal(delivery, "with_worker")} variant="secondary">
                        <UserCheck className="h-4 w-4 mr-2" />Hand to Worker
                      </Button>
                      <Button onClick={() => openModal(delivery, "completed")} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />Deliver
                      </Button>
                    </>
                  )}
                  {delivery.status === "with_worker" && (
                    <Button onClick={() => openModal(delivery, "completed")} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />Deliver
                    </Button>
                  )}
                  {delivery.status === "completed" && (
                    <div className="px-4 py-2 bg-green-100 text-green-800 rounded border border-green-300 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Delivered</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Confirmation Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Confirm Action</h3>
              <button onClick={closeModal}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <p>
              Are you sure you want to <strong>{modal.action.replace("_", " ")}</strong> this delivery for <strong>{modal.delivery?.studentName}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={confirmAction}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
