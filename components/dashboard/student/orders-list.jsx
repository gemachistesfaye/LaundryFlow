"use client"

import { useState } from "react"
import { Trash2, Star, Eye, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderDetailsModal } from "./order-details-modal"

export function OrdersList({ orders, onOrdersUpdated }) {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending_coordinator_approval":
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border border-blue-300"
      case "completed":
        return "bg-green-100 text-green-800 border border-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300"
    }
  }

  const formatStatus = (status) =>
    status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

  const handleCancelOrder = (orderId) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      console.log("Canceling order:", orderId)
      onOrdersUpdated()
    }
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Items</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rating</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id} className={idx !== orders.length - 1 ? "border-b border-border" : ""}>
                <td className="px-6 py-4 text-sm text-foreground font-mono">#{order.id}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {Array.isArray(order.items) ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} × {item.quantity} ({item.price * item.quantity} ETB)
                        </li>
                      ))}
                    </ul>
                  ) : (
                    order.items
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground">
                  {order.totalPrice} ETB
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      order.status
                    )}`}
                  >
                    {formatStatus(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {order.rating ? (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-foreground">{order.rating}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(order)} className="p-1 h-auto">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {order.status === "pending_coordinator_approval" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        className="p-1 h-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {order.status === "pending_payment_proof" && (
                      <Button variant="ghost" size="sm" className="p-1 h-auto text-primary">
                        <FileUp className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderDetailsModal
        isOpen={showDetailsModal}
        order={selectedOrder}
        onClose={() => setShowDetailsModal(false)}
      />
    </>
  )
}
