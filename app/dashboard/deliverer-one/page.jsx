"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DelivererDashboard } from "@/components/dashboard/deliverer/deliverer-dashboard"

export default function WorkerOnePage() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    if (!storedUser || !token) return router.push("/auth/login")

    const userData = JSON.parse(storedUser)
    if (userData.role.toLowerCase() !== "deliverer one") return router.push("/auth/login")

    setUser(userData)
  }, [router])

  if (!user) return null
  return <DelivererDashboard user={user} />
}
