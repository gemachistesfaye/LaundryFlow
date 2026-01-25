"use client"

import type React from "react"
import { useEffect } from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: "light" | "dark"
}

export function ThemeProvider({ children, defaultTheme = "light" }: ThemeProviderProps) {
  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const theme = savedTheme || defaultTheme

    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [defaultTheme])

  return <>{children}</>
}
