// D:\v0-smart-wash-hub\app\dashboard\student\page.jsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { StudentDashboard } from "@/components/dashboard/student/student-dashboard"
import { CreateOrderModal } from "@/components/dashboard/student/create-order-modal"

export default function StudentPage() {
  const [user, setUser] = useState(null)
  const [isDark, setIsDark] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true) // 💡 New loading state
  const router = useRouter()

  useEffect(() => {
    // 💡 Add a small delay to prevent race conditions with localStorage updates post-login
    const authCheckTimer = setTimeout(() => {
      const storedUser = localStorage.getItem("user")
      const token = localStorage.getItem("token")

      if (!storedUser || !token) {
        console.log("Redirect → no user/token")
        router.replace("/auth/login") // 💡 Use replace()
        return
      }

      let userData
      try {
        userData = JSON.parse(storedUser)
      } catch (err) {
        console.error("Failed to parse stored user:", err)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        router.replace("/auth/login") // 💡 Use replace()
        return
      }

      if (!userData || userData.role.toLowerCase() !== "student") {
        console.log("Not student → redirecting")
        // Optionally redirect to a generic dashboard based on role, but for now, back to login
        router.replace("/auth/login") // 💡 Use replace()
        return
      }

      // If all checks pass:
      setUser(userData)
      setLoading(false) // 💡 Stop loading, allow dashboard render

      // Apply dark mode if saved
      const darkMode = localStorage.getItem("theme") === "dark"
      setIsDark(darkMode)
      document.documentElement.classList.toggle("dark", darkMode)
    }, 50) // 50ms delay for stability

    return () => clearTimeout(authCheckTimer) // Cleanup timer on unmount
  }, [router])

  const handleThemeToggle = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")
    document.documentElement.classList.toggle("dark", newIsDark)
  }

  const handleOrderCreated = (order) => {
    console.log("New order created:", order)
  }

  // 💡 Show loading screen until authentication check is complete
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background dark:bg-gray-900">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading Student Dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Navbar
        userName={user.name}
        userRole={user.role}
        user={user}
        onThemeToggle={handleThemeToggle}
        isDark={isDark}
      />

      <div className="p-6">
        <StudentDashboard user={user} onOpenModal={() => setModalOpen(true)} />
      </div>

      {modalOpen && (
        <CreateOrderModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onOrderCreated={handleOrderCreated}
          user={user}
        />
      )}
    </div>
  )
}