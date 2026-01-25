"use client"

import { useState } from "react"
import { Users, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AssignmentPanel({ orders, onOrdersUpdated }) {
  const [selectedWorker, setSelectedWorker] = useState({})
  const [selectedDeliverer, setSelectedDeliverer] = useState({})
  const [loadingOrders, setLoadingOrders] = useState({})
  const [errors, setErrors] = useState({})
  const [successOrders, setSuccessOrders] = useState({})

  const assignableOrders = orders.filter((o) => o.status === "waiting_worker_assignment")

  const workers = [
    { id: "w1", name: "Worker #1", available: true },
    { id: "w2", name: "Worker #2", available: true },
    { id: "w3", name: "Worker #3", available: false },
  ]

  const deliverers = [
    { id: "d1", name: "Deliverer #1", available: true },
    { id: "d2", name: "Deliverer #2", available: true },
  ]

  const handleAssign = async (orderId) => {
    if (!selectedWorker[orderId] || !selectedDeliverer[orderId]) {
      setErrors({ ...errors, [orderId]: "Please select both a worker and deliverer" })
      return
    }

    setErrors({ ...errors, [orderId]: "" })
    setLoadingOrders({ ...loadingOrders, [orderId]: true })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log(
        "Assigning order:",
        orderId,
        selectedWorker[orderId],
        selectedDeliverer[orderId]
      )

      setSuccessOrders({ ...successOrders, [orderId]: true })
      onOrdersUpdated()
    } catch (err) {
      setErrors({ ...errors, [orderId]: "Failed to assign. Please try again." })
      console.error(err)
    } finally {
      setLoadingOrders({ ...loadingOrders, [orderId]: false })
    }
  }

  if (assignableOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">No orders waiting for assignment</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {assignableOrders.map((order) => (
        <div
          key={order.id}
          className={`border border-border rounded-lg p-4 transition-colors ${
            successOrders[order.id] ? "bg-green-50" : "hover:bg-muted/50"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Student</p>
              <p className="font-semibold text-foreground">{order.studentName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Order Details</p>
              <p className="font-semibold text-foreground">{order.items}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
              <p className="text-sm font-medium text-primary">Waiting Assignment</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" /> Assign Worker
              </label>
              <select
                value={selectedWorker[order.id] || ""}
                onChange={(e) =>
                  setSelectedWorker({ ...selectedWorker, [order.id]: e.target.value })
                }
                className="w-full p-2 bg-background border border-border rounded-lg text-foreground text-sm"
              >
                <option value="">Select a worker...</option>
                {workers.map((w) => (
                  <option key={w.id} value={w.id} disabled={!w.available}>
                    {w.name} {!w.available ? "(Busy)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4" /> Assign Deliverer
              </label>
              <select
                value={selectedDeliverer[order.id] || ""}
                onChange={(e) =>
                  setSelectedDeliverer({ ...selectedDeliverer, [order.id]: e.target.value })
                }
                className="w-full p-2 bg-background border border-border rounded-lg text-foreground text-sm"
              >
                <option value="">Select a deliverer...</option>
                {deliverers.map((d) => (
                  <option key={d.id} value={d.id} disabled={!d.available}>
                    {d.name} {!d.available ? "(Busy)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errors[order.id] && (
            <p className="text-destructive text-xs mb-2">{errors[order.id]}</p>
          )}

          <Button
            onClick={() => handleAssign(order.id)}
            className="w-full"
            disabled={loadingOrders[order.id] || successOrders[order.id]}
          >
            {loadingOrders[order.id]
              ? "Assigning..."
              : successOrders[order.id]
              ? "Assigned ✅"
              : "Assign Workers"}
          </Button>
        </div>
      ))}
    </div>
  )
}
