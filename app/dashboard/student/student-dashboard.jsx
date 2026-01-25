"use client"

import { Button } from "@/components/ui/button"

export function StudentDashboard({ user, onOpenModal }) {
  if (!user) return null

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>

      <div className="flex flex-col gap-4">
        {/* Create Order Button */}
        <Button onClick={onOpenModal} className="w-48">
          Create New Order
        </Button>

        {/* Student Info */}
        <div className="bg-card p-4 rounded-lg border border-border">
          <h3 className="font-semibold mb-2">Student Info</h3>
          <p><strong>University ID:</strong> {user.universityId || "N/A"}</p>
          <p><strong>College:</strong> {user.college || "N/A"}</p>
          <p><strong>Department:</strong> {user.department || "N/A"}</p>
          <p><strong>Building:</strong> {user.building || "N/A"}</p>
          <p><strong>Dorm/Room:</strong> {user.dorm || "N/A"}</p>
        </div>
      </div>
    </div>
  )
}
