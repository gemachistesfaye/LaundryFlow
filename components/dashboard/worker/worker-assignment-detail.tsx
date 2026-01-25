"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WorkerAssignmentDetailProps {
  isOpen: boolean
  assignment: any
  onClose: () => void
  onSubmit: (data: any) => void
}

export function WorkerAssignmentDetail({ isOpen, assignment, onClose, onSubmit }: WorkerAssignmentDetailProps) {
  const [qualityRating, setQualityRating] = useState(5)
  const [photo, setPhoto] = useState<File | null>(null)
  const [notes, setNotes] = useState("")

  if (!isOpen || !assignment) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      assignmentId: assignment.id,
      qualityRating,
      photo,
      notes,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-semibold text-foreground">Complete Assignment</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Assignment Details</h3>
            <div className="space-y-2 text-sm bg-muted p-3 rounded">
              <p>
                <span className="text-muted-foreground">Student:</span>{" "}
                <span className="font-medium text-foreground">{assignment.studentName}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Location:</span>{" "}
                <span className="font-medium text-foreground">
                  {assignment.building}, Room {assignment.room}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Quantity:</span>{" "}
                <span className="font-medium text-foreground">{assignment.quantity} bag(s)</span>
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Quality Rating (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setQualityRating(rating)}
                  className={`px-4 py-2 rounded border transition-colors ${
                    qualityRating === rating
                      ? "bg-primary text-white border-primary"
                      : "bg-background border-border text-foreground hover:border-primary"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Completion Photo</label>
            <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{photo ? photo.name : "Click to upload photo"}</span>
              <input
                type="file"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about the washing..."
              className="w-full p-3 bg-background border border-border rounded-lg text-foreground text-sm resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
