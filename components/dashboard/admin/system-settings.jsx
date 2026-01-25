"use client"

import { useState } from "react"
import { Settings, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SystemSettings() {
  // Controlled state
  const [pricing, setPricing] = useState({ pricePerBag: 5, bulkDiscount: 10 })
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    summary: true,
  })
  const [hours, setHours] = useState({ open: "08:00", close: "20:00" })

  const handleSave = () => {
    // Here you can send these settings to your backend
    console.log({ pricing, notifications, hours })
    alert("Settings saved successfully!")
  }

  const handleCancel = () => {
    // Reset to initial values or fetch latest from backend
    setPricing({ pricePerBag: 5, bulkDiscount: 10 })
    setNotifications({ email: true, sms: true, summary: true })
    setHours({ open: "08:00", close: "20:00" })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Info */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground">
          System settings affect all users. Changes are applied immediately.
        </p>
      </div>

      <div className="space-y-6">
        {/* Pricing Settings */}
        <div className="border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Pricing Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price per Bag ($)
              </label>
              <Input
                type="number"
                step="0.01"
                value={pricing.pricePerBag}
                onChange={(e) =>
                  setPricing((prev) => ({ ...prev, pricePerBag: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Bulk Discount (3+ bags %)
              </label>
              <Input
                type="number"
                step="1"
                value={pricing.bulkDiscount}
                onChange={(e) =>
                  setPricing((prev) => ({ ...prev, bulkDiscount: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Settings
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() =>
                  setNotifications((prev) => ({ ...prev, email: !prev.email }))
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Email notifications for new orders</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={() =>
                  setNotifications((prev) => ({ ...prev, sms: !prev.sms }))
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">SMS alerts for critical events</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.summary}
                onChange={() =>
                  setNotifications((prev) => ({ ...prev, summary: !prev.summary }))
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Daily summary reports</span>
            </label>
          </div>
        </div>

        {/* Business Hours */}
        <div className="border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Business Hours
          </h3>
          <div className="space-y-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Opening Time
              </label>
              <Input
                type="time"
                value={hours.open}
                onChange={(e) => setHours((prev) => ({ ...prev, open: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Closing Time
              </label>
              <Input
                type="time"
                value={hours.close}
                onChange={(e) => setHours((prev) => ({ ...prev, close: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Backup & Maintenance */}
        <div className="border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Backup & Maintenance
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Last backup: 2 hours ago
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Create Backup Now
            </Button>
          </div>
        </div>

        {/* Save & Cancel Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
