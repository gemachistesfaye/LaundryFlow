"use client"

import { useState } from "react"
import { Menu, X, Moon, Sun, LogOut, Bell, Edit2, User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationPanel } from "@/components/notifications/notification-panel"
import { useNotifications } from "@/hooks/use-notifications"

// Define editable fields for each role
const ROLE_FIELDS = {
  student: [
    { label: "Full Name", name: "name", placeholder: "Gemachis Tesfaye", icon: User },
    { label: "Phone", name: "phone", placeholder: "+25197761074", icon: Phone },
    { label: "Email", name: "email", type: "email", placeholder: "student@gmail.com", icon: Mail },
    { label: "University ID", name: "universityId", placeholder: "UGPRXXXX/XX" },
    { label: "College", name: "college", placeholder: "CCI" },
    { label: "Department", name: "department", placeholder: "Information Science" },
    { label: "Building", name: "building", placeholder: "SAT1A" },
    { label: "Dorm", name: "dorm", placeholder: "403" },
    { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
  ],
  worker: [
    { label: "Full Name", name: "name", placeholder: "Worker Name" },
    { label: "Phone", name: "phone", placeholder: "+2519xxxxxxx" },
    { label: "Email", name: "email", type: "email", placeholder: "worker@gmail.com" },
    { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
  ],
  deliverer: [
    { label: "Full Name", name: "name", placeholder: "Deliverer Name" },
    { label: "Phone", name: "phone", placeholder: "+2519xxxxxxx" },
    { label: "Email", name: "email", type: "email", placeholder: "deliverer@gmail.com" },
    { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
  ],
  coordinator: [
    { label: "Full Name", name: "name", placeholder: "Coordinator Name" },
    { label: "Phone", name: "phone", placeholder: "+2519xxxxxxx" },
    { label: "Email", name: "email", type: "email", placeholder: "coordinator@gmail.com" },
    { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
  ],
  admin: [
    { label: "Full Name", name: "name", placeholder: "Admin Name" },
    { label: "Email", name: "email", type: "email", placeholder: "admin@gmail.com" },
    { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
  ],
}

export function Navbar({ user, onThemeToggle, isDark }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { unreadCount } = useNotifications(user?.id || "1")
  const [tempUser, setTempUser] = useState(user || {})

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const handleProfileUpdate = () => {
    localStorage.setItem("user", JSON.stringify(tempUser))
    window.location.reload()
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setTempUser({ ...tempUser, profilePicture: ev.target.result })
    reader.readAsDataURL(file)
  }

  const fields = ROLE_FIELDS[user?.role] || []

  return (
    <>
      <nav className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{user?.name || "User"}</div>
                <div className="text-xs text-muted-foreground capitalize">{user?.role || "user"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationOpen(true)}
                className="rounded-full relative hover:bg-muted transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onThemeToggle}
                className="rounded-full hover:bg-muted transition-colors"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-full hover:bg-muted transition-colors"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="border-t border-border py-2 animate-in fade-in slide-in-from-top-2 flex flex-col gap-2">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-muted transition-colors flex items-center gap-2"
                onClick={() => { setTempUser(user); setIsProfileOpen(true) }}
              >
                <Edit2 className="h-4 w-4" /> Edit Profile
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          )}
        </div>
      </nav>

      <NotificationPanel
        userId={user?.id || "1"}
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

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
              {/* Profile Picture for students */}
              {user?.role === "student" && (
                <div className="flex flex-col items-center">
                  <img
                    src={tempUser?.profilePicture || "/default-avatar.png"}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover mb-2 border border-border"
                  />
                  <div className="flex gap-2">
                    <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
                    <button
                      onClick={() => setTempUser({ ...tempUser, profilePicture: "" })}
                      className="text-sm text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Role-specific fields */}
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="text-sm font-medium text-foreground">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={tempUser[field.name] || ""}
                    onChange={(e) => setTempUser({ ...tempUser, [field.name]: e.target.value })}
                    className="mt-1 w-full border border-border rounded px-2 py-1"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsProfileOpen(false)}>Cancel</Button>
              <Button onClick={handleProfileUpdate}>Update</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
