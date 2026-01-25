"use client"

import { X, Star } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function OrderDetailsModal({ isOpen, order, onClose }) {
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState(0)

  if (!isOpen || !order) return null

  const items = Array.isArray(order.items)
    ? order.items
    : [{ name: order.items || "Item", quantity: 1, price: order.totalPrice || 0 }]

  const incompleteItems = items.filter(item => order.status !== "completed")

  const handleSendMessage = () => {
    console.log("Message sent to coordinator:", message)
    alert("Message sent to coordinator!")
    setMessage("")
  }

  const handleSendRating = () => {
    console.log("Thanks and rating submitted:", rating)
    alert(`Thanks and rating submitted: ${rating} stars`)
    setRating(0)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-semibold text-foreground">Order Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Order Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order ID</p>
                <p className="font-mono text-foreground">#{order.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Price</p>
                <p className="font-semibold text-foreground">{order.totalPrice} ETB</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Date Ordered</p>
                <p className="text-foreground">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3 pb-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Items</h3>
            <div className="text-sm space-y-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between border-b border-border py-1">
                  <div>{item.name} x {item.quantity}</div>
                  <div>{item.price * item.quantity} ETB</div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          {order.notes && (
            <div className="space-y-3 pb-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Special Instructions</h3>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}

          {/* Incomplete / In-progress Message */}
          {(order.status === "in_progress" || order.status === "pending_coordinator_approval") && (
            <div className="space-y-3 pb-4 border-b border-border">
              <h3 className="font-semibold text-foreground text-red-600">Send Message to Coordinator</h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message regarding incomplete items..."
                className="w-full p-2 border rounded text-sm resize-none"
                rows={3}
              />
              <Button onClick={handleSendMessage} className="w-full">
                Send Message
              </Button>
            </div>
          )}

          {/* Completed Thanks & Rating */}
          {order.status === "completed" && (
            <div className="space-y-3 pb-4 border-b border-border">
              <h3 className="font-semibold text-foreground text-green-600">Send Thanks & Rate</h3>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <Button onClick={handleSendRating} className="w-full mt-2">
                Submit Rating
              </Button>
            </div>
          )}

          {/* Close Button */}
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
