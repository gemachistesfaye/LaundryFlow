import { type NextRequest, NextResponse } from "next/server"

// API endpoint for updating order status and triggering notifications
export async function POST(request: NextRequest) {
  try {
    const { orderId, status, userId } = await request.json()

    // In production: update database, verify permissions
    const notification = {
      orderId,
      status,
      type: getNotificationType(status),
      title: getNotificationTitle(status),
      message: getNotificationMessage(status),
      timestamp: new Date(),
    }

    // In production: emit WebSocket event or send notification
    console.log("Order status updated:", notification)

    return NextResponse.json({
      success: true,
      notification,
    })
  } catch (error) {
    console.error("Order update error:", error)
    return NextResponse.json({ message: "Failed to update order status" }, { status: 500 })
  }
}

function getNotificationType(status: string) {
  const types: { [key: string]: string } = {
    approved: "order_approved",
    assigned: "worker_assigned",
    ready: "order_ready",
    delivered: "delivered",
  }
  return types[status] || "order_update"
}

function getNotificationTitle(status: string) {
  const titles: { [key: string]: string } = {
    approved: "Order Approved",
    assigned: "Worker Assigned",
    ready: "Ready for Delivery",
    delivered: "Order Delivered",
  }
  return titles[status] || "Order Updated"
}

function getNotificationMessage(status: string) {
  const messages: { [key: string]: string } = {
    approved: "Your order has been approved by the coordinator",
    assigned: "A worker has been assigned to process your order",
    ready: "Your order is ready for delivery",
    delivered: "Your order has been successfully delivered",
  }
  return messages[status] || "Your order status has been updated"
}
