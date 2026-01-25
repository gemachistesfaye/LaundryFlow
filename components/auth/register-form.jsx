"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Phone, Mail, Building2, BookOpen, MapPin, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function RegisterForm({ switchToLogin, onRegistered }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    universityId: "",
    college: "",
    department: "",
    building: "",
    dorm: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Full name is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    else if (!/^\+?\d{7,15}$/.test(formData.phone)) newErrors.phone = "Invalid phone number"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email"
    if (!formData.universityId.trim()) newErrors.universityId = "University ID is required"
    if (!formData.college.trim()) newErrors.college = "College is required"
    if (!formData.department.trim()) newErrors.department = "Department is required"
    if (!formData.building.trim()) newErrors.building = "Building is required"
    if (!formData.dorm.trim()) newErrors.dorm = "Dorm/Room is required"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setErrors({})

    if (!validate()) return

    setLoading(true)
    try {
      // Call backend API to store in MySQL
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (res.ok) {
        // Call parent callback
        if (onRegistered) onRegistered(data.user)

        // Redirect to student dashboard (optional, parent can also handle)
        router.push("/dashboard/student")
      } else {
        setErrors({ general: data.message || "Registration failed" })
      }
    } catch (err) {
      console.error(err)
      setErrors({ general: "An unexpected error occurred. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const InputField = ({ label, name, type = "text", placeholder, icon: Icon, showToggle, showValue, onToggle }) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
        <Input
          type={showToggle && showValue ? "text" : type}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          className={`pl-9 ${showToggle ? "pr-9" : "pr-3"} text-sm`}
          required
        />
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {errors[name] && <p className="text-destructive text-xs mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <form
      onSubmit={handleRegister}
      className="bg-card border border-border rounded-lg p-6 space-y-4 max-h-[70vh] overflow-y-auto"
    >
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Full Name" name="name" placeholder="your full name" icon={User} />
        <InputField label="Phone" name="phone" placeholder="+2519xxxxxxxx" icon={Phone} />
        <InputField label="Email" name="email" type="email" placeholder="your email" icon={Mail} />
        <InputField label="University ID" name="universityId" placeholder="UGPRXXXX/XX" icon={Building2} />
        <InputField label="College" name="college" placeholder="CCI" icon={BookOpen} />
        <InputField label="Department" name="department" placeholder="Information Science" />
        <InputField label="Building" name="building" placeholder="SAT1A" icon={Building2} />
        <InputField label="Dorm" name="dorm" placeholder="403" icon={MapPin} />
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          showToggle
          showValue={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />
        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          showToggle
          showValue={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
        />
      </div>

      {errors.general && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded text-sm">
          {errors.general}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Register"}
      </Button>

      {/* Switch to Login */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button onClick={switchToLogin} className="text-primary font-semibold hover:underline">
          Login here
        </button>
      </div>
    </form>
  )
}
