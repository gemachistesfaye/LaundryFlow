"use client"

import { useState, useEffect } from "react"
import { Plus, History, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreateOrderModal } from "./create-order-modal"
import { OrdersList } from "./orders-list"
import { Navbar } from "@/components/layout/navbar" // ✅ named import

export default function StudentDashboard({ initialUser }) {
  const [user, setUser] = useState(initialUser || null)
  const [orders, setOrders] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tempUser, setTempUser] = useState(initialUser || {})
  const [errors, setErrors] = useState({})
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    fetchOrders()
    // Initialize dark mode from localStorage
    const darkMode = localStorage.getItem("theme") === "dark"
    setIsDark(darkMode)
    if (darkMode) document.documentElement.classList.add("dark")
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setOrders([
        {
          id: "1",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          quantity: 3,
          status: "completed",
          items: "3 bags of clothes",
          totalPrice: 15,
          rating: 4.5,
        },
        {
          id: "2",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          quantity: 2,
          status: "in_progress",
          items: "2 bags of clothes",
          totalPrice: 10,
        },
      ])
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderCreated = (newOrder) => {
    setOrders([newOrder, ...orders])
    setIsModalOpen(false)
  }

  const handleProfileUpdate = () => {
    let valid = true
    const newErrors = {}

    if (!tempUser.email || !/\S+@\S+\.\S+/.test(tempUser.email)) {
      newErrors.email = "Invalid email"
      valid = false
    }
    if (!tempUser.phone || !/^\+?\d{7,15}$/.test(tempUser.phone)) {
      newErrors.phone = "Invalid phone"
      valid = false
    }

    setErrors(newErrors)
    if (!valid) return
    if (!confirm("Are you sure you want to update your profile?")) return

    setUser(tempUser)
    localStorage.setItem("user", JSON.stringify(tempUser))
    setIsProfileOpen(false)
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setTempUser({ ...tempUser, profilePicture: ev.target.result })
    reader.readAsDataURL(file)
  }

  const handleThemeToggle = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")
    if (newIsDark) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    inProgress: orders.filter((o) => o.status === "in_progress").length,
  }

  return (
    <>
      {/* Render Navbar only if user exists */}
      {user && (
        <Navbar
          userName={user.name || "Student"}
          userRole="Student"
          userId={user.id || "1"}
          isDark={isDark}
          onThemeToggle={handleThemeToggle}
          onProfileOpen={() => {
            setTempUser(user)
            setIsProfileOpen(true)
          }}
        />
      )}

      <main className="max-w-6xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Total Orders</div>
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Pending Approval</div>
            <div className="text-3xl font-bold text-foreground">{stats.pending}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">In Progress</div>
            <div className="text-3xl font-bold text-foreground">{stats.inProgress}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">Create a New Order</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Schedule your laundry pickup and get your clothes washed professionally.
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Order History</h2>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center text-muted-foreground">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No orders yet. Create your first order to get started.
            </div>
          ) : (
            <OrdersList orders={orders} onOrdersUpdated={fetchOrders} />
          )}
        </div>

        {/* Create Order Modal */}
        <CreateOrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onOrderCreated={handleOrderCreated}
          user={user}
        />

        {/* Profile Modal */}
        {isProfileOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-lg max-w-lg w-full p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foreground">Edit Profile</h2>
                <button onClick={() => setIsProfileOpen(false)} className="p-1 hover:bg-muted rounded">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <img
                    src={tempUser.profilePicture || "/default-avatar.png"}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover mb-2 border border-border"
                  />
                  <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
                </div>

                {/* Editable Fields */}
                {Object.keys(tempUser).map((key) => {
                  if (["id", "profilePicture"].includes(key)) return null
                  return (
                    <div key={key}>
                      <label className="text-sm font-medium text-foreground capitalize">{key}</label>
                      <Input
                        value={tempUser[key] || ""}
                        onChange={(e) => setTempUser({ ...tempUser, [key]: e.target.value })}
                        className="mt-1"
                      />
                      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsProfileOpen(false)}>Cancel</Button>
                <Button onClick={handleProfileUpdate}>Update</Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
