"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react"

export function AnalyticsOverview() {
  const [stats, setStats] = useState([
    { label: "Total Orders", value: "2,847", change: "+12.5%", icon: ShoppingCart, color: "blue" },
    { label: "Total Users", value: "486", change: "+4.2%", icon: Users, color: "purple" },
    { label: "Revenue", value: "$28,450", change: "+8.3%", icon: DollarSign, color: "green" },
    { label: "Avg Order Value", value: "$9.98", change: "-2.1%", icon: TrendingUp, color: "yellow" },
  ])

  // Example: fetch real-time stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats")
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 5000) // refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const dailyOrders = [
    { day: "Mon", orders: 45, percent: 60 },
    { day: "Tue", orders: 52, percent: 75 },
    { day: "Wed", orders: 48, percent: 70 },
    { day: "Thu", orders: 61, percent: 85 },
    { day: "Fri", orders: 55, percent: 78 },
    { day: "Sat", orders: 42, percent: 60 },
    { day: "Sun", orders: 38, percent: 50 },
  ]

  const systemHealth = [
    { label: "Coordinator Response Time", value: "2.3 min", percent: 92, color: "green" },
    { label: "Worker Completion Rate", value: "98%", percent: 98, color: "green" },
    { label: "Delivery Success Rate", value: "96%", percent: 96, color: "green" },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className={`text-sm font-semibold ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Daily Orders & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Orders */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Daily Orders (Last 7 Days)</h3>
          <div className="space-y-3">
            {dailyOrders.map((item) => (
              <div key={item.day}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-foreground">{item.day}</span>
                  <span className="text-muted-foreground">{item.orders} orders</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">System Health</h3>
          <div className="space-y-4">
            {systemHealth.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-green-600 font-semibold">{item.value}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`h-2 rounded-full bg-green-500`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
