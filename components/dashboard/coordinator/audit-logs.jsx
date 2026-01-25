"use client"

import { useState } from "react"
import {
  Clock,
  User,
  CheckCircle,
  XCircle,
  Users,
  CreditCard,
  Info,
  Filter,
  Search
} from "lucide-react"

export function AuditLogs() {
  const logs = [
    { id: 1, action: "Order Approved", user: "Coordinator - You", timestamp: new Date(Date.now() - 30 * 60 * 1000), orderId: "#1001" },
    { id: 2, action: "Worker Assigned", user: "System", timestamp: new Date(Date.now() - 60 * 60 * 1000), orderId: "#1002" },
    { id: 3, action: "Payment Verified", user: "System", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), orderId: "#999" },
    { id: 4, action: "Order Rejected", user: "Coordinator - You", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), orderId: "#998" },
  ]

  const [search, setSearch] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterUser, setFilterUser] = useState("all")

  const actionOptions = [
    "Order Approved",
    "Order Rejected",
    "Worker Assigned",
    "Payment Verified"
  ]

  const getActionIcon = (action) => {
    switch (action) {
      case "Order Approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Order Rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "Worker Assigned":
        return <Users className="h-4 w-4 text-blue-500" />
      case "Payment Verified":
        return <CreditCard className="h-4 w-4 text-yellow-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const timeAgo = (timestamp) => {
    const diff = Date.now() - timestamp
    if (diff < 60000) return "just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`
    return timestamp.toLocaleDateString() + " " + timestamp.toLocaleTimeString()
  }

  const sorted = [...logs].sort((a, b) => b.timestamp - a.timestamp)

  const filteredLogs = sorted.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.orderId.toLowerCase().includes(search.toLowerCase())

    const matchesAction = filterAction === "all" || log.action === filterAction
    const matchesUser = filterUser === "all" || log.user.startsWith(filterUser)

    return matchesSearch && matchesAction && matchesUser
  })

  return (
    <div className="space-y-4">

      {/* SEARCH + FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Search */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-2 bg-background border border-border rounded-lg text-sm"
          />
        </div>

        {/* Action Filter */}
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
            <Filter className="h-3 w-3" /> Filter by Action
          </div>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full p-2 bg-background border border-border rounded-lg text-sm"
          >
            <option value="all">All Actions</option>
            {actionOptions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* User Filter */}
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" /> Filter by User
          </div>
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="w-full p-2 bg-background border border-border rounded-lg text-sm"
          >
            <option value="all">All Users</option>
            <option value="Coordinator">Coordinator</option>
            <option value="System">System</option>
          </select>
        </div>

      </div>

      {/* LOG TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
              <th className="px-4 py-3 text-left font-semibold">User</th>
              <th className="px-4 py-3 text-left font-semibold">Order ID</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-muted-foreground">
                  No logs found
                </td>
              </tr>
            )}

            {filteredLogs.map((log, idx) => (
              <tr
                key={log.id}
                className={`${
                  idx !== filteredLogs.length - 1 ? "border-b border-border" : ""
                } hover:bg-muted/50 transition-colors`}
              >
                <td className="px-4 py-3 flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {timeAgo(log.timestamp)}
                </td>

                <td className="px-4 py-3 flex items-center gap-2 font-medium">
                  {getActionIcon(log.action)}
                  {log.action}
                </td>

                <td className="px-4 py-3 flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  {log.user}
                </td>

                <td className="px-4 py-3 font-mono">{log.orderId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
