"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CoordinatorDashboard } from "@/components/dashboard/coordinator/coordinator-dashboard"

export default function CoordinatorPage() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    if (!storedUser || !token) return router.push("/auth/login")

    const userData = JSON.parse(storedUser)
    if (userData.role.toLowerCase() !== "coordinator") return router.push("/auth/login")

    setUser(userData)
  }, [router])

  if (!user) return null
  return <CoordinatorDashboard user={user} />
}
