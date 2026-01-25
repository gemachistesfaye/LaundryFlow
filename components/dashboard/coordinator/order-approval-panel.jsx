"use client"

import { useState } from "react"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OrderApprovalPanel({ orders, onOrdersUpdated }) {
  const pendingOrders = orders.filter(o => o.status === "pending_coordinator_approval")

  const [loadingOrder, setLoadingOrder] = useState(null)

  const handleApprove = async (orderId) => {
    setLoadingOrder(orderId)

    try {
      // Example API call
      /*
      await fetch(`/api/orders/${orderId}/approve`, {
        method: "POST"
      })
      */

      console.log("Approving order:", orderId)
      onOrdersUpdated()
    } catch (err) {
      console.error(err)
      alert("Failed to approve order. Try again.")
    } finally {
      setLoadingOrder(null)
    }
  }

  const handleReject = async (orderId) => {
    if (!confirm("Are you sure you want to reject this order?")) return

    setLoadingOrder(orderId)

    try {
      // Example API call
      /*
      await fetch(`/api/orders/${orderId}/reject`, {
        method: "POST"
      })
      */

      console.log("Rejecting order:", orderId)
      onOrdersUpdated()
    } catch (err) {
      console.error(err)
      alert("Failed to reject order. Try again.")
    } finally {
      setLoadingOrder(null)
    }
  }

  if (pendingOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">No orders pending approval</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pendingOrders.map(order => {
        const isLoading = loadingOrder === order.id

        return (
          <div key={order.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
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
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Requested</p>
                <p className="text-sm text-foreground">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Unknown time"}
                </p>
              </div>
            </div>

            {order.notes && (
              <div className="flex items-start gap-2 mb-4 p-3 bg-primary/5 border border-primary/20 rounded">
                <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{order.notes}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => handleApprove(order.id)}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Processing..." : "Approve"}
              </Button>

              <Button
                variant="outline"
                onClick={() => handleReject(order.id)}
                className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Processing..." : "Reject"}
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
