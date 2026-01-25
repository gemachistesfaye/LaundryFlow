"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WorkerAssignmentDetail } from "./worker-assignment-detail"

interface WorkerAssignmentsListProps {
  assignments: any[]
  onAssignmentsUpdated: () => void
}

export function WorkerAssignmentsList({ assignments, onAssignmentsUpdated }: WorkerAssignmentsListProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return { bg: "bg-yellow-100 text-yellow-800 border-yellow-300", label: "Pending Confirmation" }
      case "confirmed":
        return { bg: "bg-blue-100 text-blue-800 border-blue-300", label: "Ready to Process" }
      case "in_washing":
        return { bg: "bg-purple-100 text-purple-800 border-purple-300", label: "Currently Washing" }
      default:
        return { bg: "bg-gray-100 text-gray-800 border-gray-300", label: status }
    }
  }

  const handleAccept = (assignmentId: string) => {
    console.log("Accepting assignment:", assignmentId)
    onAssignmentsUpdated()
  }

  const handleReject = (assignmentId: string) => {
    if (confirm("Are you sure you want to reject this assignment?")) {
      console.log("Rejecting assignment:", assignmentId)
      onAssignmentsUpdated()
    }
  }

  const handleMarkDone = (assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId)
    setSelectedAssignment(assignment)
    setShowDetailModal(true)
  }

  return (
    <>
      <div className="divide-y divide-border">
        {assignments.map((assignment) => {
          const statusInfo = getStatusBadge(assignment.status)
          return (
            <div key={assignment.id} className="p-6 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{assignment.studentName}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">
                        {assignment.building}, Room {assignment.room}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-medium text-foreground">{assignment.quantity} bag(s)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Assigned</p>
                      <p className="font-medium text-foreground">
                        {new Date(assignment.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Est. Pickup</p>
                      <p className="font-medium text-foreground">9:00 AM</p>
                    </div>
                  </div>
                  {assignment.notes && (
                    <div className="mt-3 p-2 bg-primary/5 border border-primary/20 rounded text-sm text-foreground">
                      <span className="font-medium">Notes:</span> {assignment.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                {assignment.status === "assigned" && (
                  <>
                    <Button
                      onClick={() => handleAccept(assignment.id)}
                      className="flex-1 md:flex-none bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(assignment.id)}
                      className="flex-1 md:flex-none text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}

                {["confirmed", "in_washing"].includes(assignment.status) && (
                  <Button onClick={() => handleMarkDone(assignment.id)} className="flex-1 md:flex-none">
                    <Camera className="h-4 w-4 mr-2" />
                    Mark as Done
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <WorkerAssignmentDetail
        isOpen={showDetailModal}
        assignment={selectedAssignment}
        onClose={() => setShowDetailModal(false)}
        onSubmit={(data) => {
          console.log("Submitting completion:", data)
          onAssignmentsUpdated()
          setShowDetailModal(false)
        }}
      />
    </>
  )
}
