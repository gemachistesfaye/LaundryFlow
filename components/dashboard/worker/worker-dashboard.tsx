"use client"

import { useState, useEffect } from "react"
import { Briefcase, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { WorkerAssignmentsList } from "./worker-assignments-list"

export function WorkerDashboard({ user }: { user: any }) {
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      // Mock data
      setAssignments([
        {
          id: "1",
          studentName: "John Doe",
          building: "Building A",
          room: "201",
          quantity: 3,
          status: "assigned",
          notes: "Delicate fabrics",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: "2",
          studentName: "Jane Smith",
          building: "Building B",
          room: "305",
          quantity: 2,
          status: "confirmed",
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
        {
          id: "3",
          studentName: "Mike Johnson",
          building: "Building A",
          room: "101",
          quantity: 1,
          status: "in_washing",
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
        },
      ])
    } catch (error) {
      console.error("Failed to fetch assignments:", error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    assigned: assignments.filter((a) => a.status === "assigned").length,
    inProgress: assignments.filter((a) => ["confirmed", "in_washing"].includes(a.status)).length,
    completed: 5,
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Pending Confirmation</div>
              <div className="text-3xl font-bold text-foreground">{stats.assigned}</div>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500 opacity-50" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">In Progress</div>
              <div className="text-3xl font-bold text-foreground">{stats.inProgress}</div>
            </div>
            <Clock className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Completed (Today)</div>
              <div className="text-3xl font-bold text-foreground">{stats.completed}</div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Your Rating</div>
              <div className="text-3xl font-bold text-foreground">4.8</div>
            </div>
            <Briefcase className="h-8 w-8 text-primary opacity-50" />
          </div>
        </div>
      </div>

      {/* Assignments */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Your Assignments</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No assignments at this time</div>
        ) : (
          <WorkerAssignmentsList assignments={assignments} onAssignmentsUpdated={fetchAssignments} />
        )}
      </div>
    </main>
  )
}
