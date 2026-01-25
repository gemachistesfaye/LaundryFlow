"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FinancialReports() {
  const [summaryStats, setSummaryStats] = useState([
    {
      label: "Total Revenue",
      value: "$28,450",
      change: "+12.5% from last month",
      icon: DollarSign,
      color: "green-600",
    },
    {
      label: "Completed Orders",
      value: "2,356",
      change: "+8.3% from last month",
      icon: TrendingUp,
      color: "blue-600",
    },
    {
      label: "Avg Order Value",
      value: "$12.08",
      change: "+1.2% from last month",
      icon: Calendar,
      color: "purple-600",
    },
  ])

  const [revenueByPeriod, setRevenueByPeriod] = useState([
    { month: "January", revenue: "$2,450", percent: 40 },
    { month: "February", revenue: "$3,200", percent: 52 },
    { month: "March", revenue: "$2,800", percent: 46 },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSummaryStats((prev) =>
        prev.map((stat) => {
          // Randomly adjust value slightly for demo purposes
          const randomChange = (Math.random() * 5 - 2.5).toFixed(2)
          return {
            ...stat,
            value:
              stat.label === "Total Revenue"
                ? `$${(28450 + parseFloat(randomChange) * 100).toLocaleString()}`
                : stat.label === "Completed Orders"
                ? `${2356 + parseInt(randomChange)}`
                : `$${(12.08 + parseFloat(randomChange) / 10).toFixed(2)}`,
          }
        })
      )

      setRevenueByPeriod((prev) =>
        prev.map((item) => ({
          ...item,
          percent: Math.min(100, Math.max(0, item.percent + Math.floor(Math.random() * 5 - 2))),
          revenue: `$${parseInt(item.revenue.replace("$", "").replace(",", "")) + Math.floor(Math.random() * 200 - 50)}`,
        }))
      )
    }, 5000) // update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <Icon className={`h-5 w-5 text-${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className={`text-xs font-semibold mt-2 text-${stat.color}`}>{stat.change}</p>
            </div>
          )
        })}
      </div>

      {/* Revenue by Period */}
      <div className="bg-background border border-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-foreground">Revenue by Period</h3>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
        <div className="space-y-3">
          {revenueByPeriod.map((item) => (
            <div key={item.month}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-foreground">{item.month}</span>
                <span className="font-semibold text-foreground">{item.revenue}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
