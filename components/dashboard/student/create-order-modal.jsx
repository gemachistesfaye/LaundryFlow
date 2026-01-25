"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Dorm-focused items with categories
const CLOTH_ITEMS = [
  // Clothing
  { name: "T-Shirt", image: "/images/tshirt.jpeg", price: 20, category: "Clothing" },
  { name: "Shirt", image: "/images/shirt.jpg", price: 20, category: "Clothing" },
  { name: "Pants", image: "/images/pants.jpeg", price: 30, category: "Clothing" },
  { name: "Shorts", image: "/images/shorts.jpg", price: 20, category: "Clothing" },
  { name: "Sweater", image: "/images/sweater.jpg", price: 40, category: "Clothing" },
  { name: "Underwear", image: "/images/underwear.jpg", price: 10, category: "Clothing" },
  { name: "Socks", image: "/images/socks.jpeg", price: 10, category: "Clothing" },
  { name: "Jacket", image: "/images/jacket.jpg", price: 50, category: "Clothing" },
  { name: "Coat", image: "/images/coat.jpg", price: 60, category: "Clothing" },
  { name: "Habesha Kemis", image: "/images/habesha_kemis.jpeg", price: 30, category: "Clothing" },
  { name: "Dress", image: "/images/dress.jpg", price: 40, category: "Clothing" },

  // Bedding
  { name: "Towel", image: "/images/towel.jpg", price: 30, category: "Bedding" },
  { name: "Bed Sheet", image: "/images/bedsheet.jpeg", price: 50, category: "Bedding" },
  { name: "Blanket", image: "/images/blanket.png", price: 40, category: "Bedding" },

  // Others
  { name: "Shoes", image: "/images/shoe.jpg", price: 35, category: "Others" },
  { name: "Bag", image: "/images/bag.jpg", price: 25, category: "Others" },
  { name: "Cap / Hat", image: "/images/hat.jpg", price: 15, category: "Others" },
  { name: "Scarf", image: "/images/scarf.jpg", price: 15, category: "Others" },
  { name: "Gloves", image: "/images/gloves.jpeg", price: 10, category: "Others" },
  { name: "Tie", image: "/images/tie.jpeg", price: 10, category: "Others" },

  // Special
  { name: "Ambassador Wool", image: "/images/ambassador_wool.jpg", price: 60, category: "Special" },
]

export function CreateOrderModal({ isOpen, onClose, onOrderCreated, user }) {
  const [quantities, setQuantities] = useState(CLOTH_ITEMS.map(() => 0))
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleQuantityChange = (index, delta) => {
    setQuantities(prev => {
      const newQuantities = [...prev]
      newQuantities[index] = Math.max(0, newQuantities[index] + delta)
      return newQuantities
    })
  }

  const removeItem = (index) => {
    setQuantities(prev => {
      const newQuantities = [...prev]
      newQuantities[index] = 0
      return newQuantities
    })
  }

  const selectedItems = CLOTH_ITEMS
    .map((item, idx) => ({ ...item, quantity: quantities[idx], index: idx }))
    .filter(item => item.quantity > 0)

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    if (selectedItems.length === 0) {
      alert("Please select at least one item")
      setLoading(false)
      return
    }

    const newOrder = {
      id: Date.now().toString(),
      createdAt: new Date(),
      items: selectedItems,
      totalPrice,
      status: "pending_coordinator_approval",
      notes,
      pickup: {
        building: user?.building || "",
        dorm: user?.dorm || "",
      },
    }

    onOrderCreated(newOrder)
    setLoading(false)
    onClose()
    setQuantities(CLOTH_ITEMS.map(() => 0))
    setNotes("")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-xl font-semibold text-foreground">Create New Washing Order</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Info */}
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border items-end">
            <div className="col-span-3">
              <h3 className="text-lg font-semibold text-foreground">Student: {user?.name}</h3>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Building</label>
              <Input disabled value={user?.building || ""} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Room/Dorm</label>
              <Input disabled value={user?.dorm || ""} className="mt-1" />
            </div>
          </div>

        {/* Compact Selected Items Row */}
{selectedItems.length > 0 && (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-sm font-semibold text-foreground">
        Selected Items
      </h4>
      <span className="text-xs text-muted-foreground">
        {selectedItems.reduce((sum, item) => sum + item.quantity, 0)} selected
      </span>
    </div>
    <div className="flex gap-4 overflow-x-auto pb-3">
      {selectedItems.map(item => (
        <div
          key={item.index}
          className="relative min-w-[120px] min-h-[140px] rounded-lg flex flex-col items-center justify-end border-2 border-green-500 bg-green-500/20 shadow-lg hover:scale-105 transition-transform cursor-pointer p-2"
        >
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-24 h-24 object-cover rounded-md mb-1" 
          />
          {/* Item Name */}
          <span className="text-sm font-semibold text-foreground text-center">{item.name}</span>
          {/* Quantity Badge */}
          <span className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {item.quantity}
          </span>
          {/* Remove Button */}
          <button
            type="button"
            onClick={() => removeItem(item.index)}
            className="absolute top-1 left-1 p-1 text-red-500 hover:text-red-700 rounded-full bg-white/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  </div>
)}


          {/* Items Grid */}
          {["Clothing", "Bedding", "Others", "Special"].map(category => {
            const items = CLOTH_ITEMS.filter(item => item.category === category)
            return (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {items.map((item) => {
                    const globalIdx = CLOTH_ITEMS.indexOf(item)
                    const selected = quantities[globalIdx] > 0
                    return (
                      <div
                        key={globalIdx}
                        className={`relative w-full h-36 rounded-lg overflow-hidden cursor-pointer flex flex-col justify-end items-center border transition-transform duration-200 hover:scale-105 hover:brightness-110 hover:shadow-lg ${selected ? "border-green-500" : "border-gray-300"}`}
                        style={{
                          backgroundImage: `url(${item.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          filter: "brightness(95%)"
                        }}
                        onClick={() => handleQuantityChange(globalIdx, 1)}
                      >
                        <div className="absolute inset-0 bg-black/25"></div>
                        <div className="relative z-10 flex flex-col items-center gap-1 pb-2 text-white text-center">
                          <div className="text-sm font-medium drop-shadow-md">{item.name}</div>
                          <div className="text-sm drop-shadow-md">{item.price} ETB</div>
                          {selected && <div className="text-xs font-semibold drop-shadow-md">{quantities[globalIdx]} selected</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Special Instructions</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Delicate items, specific fabric care, etc."
              className="w-full p-3 bg-background border border-border rounded-lg text-foreground text-sm resize-none"
              rows={4}
            />
          </div>

          {/* Each Item Price Before Total */}
          {selectedItems.length > 0 && (
            <div className="space-y-1">
              {selectedItems.map(item => (
                <div key={item.index} className="flex justify-between text-sm text-foreground">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{item.price * item.quantity} ETB</span>
                </div>
              ))}
            </div>
          )}

          {/* Total & Buttons */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-lg font-semibold text-foreground">Total: {totalPrice} ETB</div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Order"}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
