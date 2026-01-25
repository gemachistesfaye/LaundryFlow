"use client"

import { useState } from "react"
import { Search, Edit2, Trash2, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@uni.edu", role: "student", joined: "2024-01-15", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@uni.edu", role: "coordinator", joined: "2024-01-10", status: "active" },
    { id: 3, name: "Mike Worker", email: "mike@uni.edu", role: "worker", joined: "2024-01-20", status: "active" },
    { id: 4, name: "David Deliverer", email: "david@uni.edu", role: "deliverer", joined: "2024-02-01", status: "inactive" },
    { id: 5, name: "Sarah Student", email: "sarah@uni.edu", role: "student", joined: "2024-02-05", status: "active" },
  ])

  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null) // null = add new
  const [formData, setFormData] = useState({ name: "", email: "", role: "student", status: "active" })

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadge = (role) => {
    const colors = {
      student: "bg-blue-100 text-blue-800 border-blue-300",
      coordinator: "bg-purple-100 text-purple-800 border-purple-300",
      worker: "bg-green-100 text-green-800 border-green-300",
      deliverer: "bg-yellow-100 text-yellow-800 border-yellow-300",
      admin: "bg-red-100 text-red-800 border-red-300",
    }
    return colors[role] || colors.student
  }

  const openAddModal = () => {
    setEditingUser(null)
    setFormData({ name: "", email: "", role: "student", status: "active" })
    setModalOpen(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, role: user.role, status: user.status })
    setModalOpen(true)
  }

  const saveUser = () => {
    if (editingUser) {
      // update
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u))
    } else {
      // add new
      const newUser = { id: Date.now(), joined: new Date().toISOString().slice(0, 10), ...formData }
      setUsers([newUser, ...users])
    }
    setModalOpen(false)
  }

  const deleteUser = (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  return (
    <div className="space-y-4 relative">
      {/* Search & Add */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="md:w-auto flex items-center gap-2" onClick={openAddModal}>
          <UserPlus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Role</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Joined</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={user.id} className={idx !== filteredUsers.length - 1 ? "border-b border-border" : ""}>
                <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.joined}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-auto p-1" onClick={() => openEditModal(user)}>
                      <Edit2 className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-auto p-1 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteUser(user.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-muted-foreground">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md relative">
            <button className="absolute top-3 right-3" onClick={() => setModalOpen(false)}>
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">{editingUser ? "Edit User" : "Add User"}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select className="w-full border border-border rounded px-2 py-1" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="student">Student</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="worker">Worker</option>
                  <option value="deliverer">Deliverer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="w-full border border-border rounded px-2 py-1" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button className="flex-1" onClick={saveUser}>{editingUser ? "Save Changes" : "Add User"}</Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setModalOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
