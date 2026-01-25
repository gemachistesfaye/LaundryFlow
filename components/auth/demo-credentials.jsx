"use client";

import { useState } from "react";
import { Shield, UserCheck, Hammer, Truck, Eye } from "lucide-react";

export function DemoCredentials({ onSelect }) {
  const demoAccounts = [
    { role: "Admin", email: "admin@smartwash.edu", password: "admin123", icon: <Shield className="w-4 h-4 text-blue-500" /> },
    { role: "Coordinator", email: "coordinator@smartwash.edu", password: "coord123", icon: <UserCheck className="w-4 h-4 text-green-500" /> },
    { role: "Worker One", email: "worker1@smartwash.edu", password: "worker123", icon: <Hammer className="w-4 h-4 text-yellow-500" /> },
    { role: "Worker Two", email: "worker2@smartwash.edu", password: "worker234", icon: <Hammer className="w-4 h-4 text-yellow-500" /> },
    { role: "Worker Three", email: "worker3@smartwash.edu", password: "worker235", icon: <Hammer className="w-4 h-4 text-yellow-500" /> },
    { role: "Deliverer One", email: "deliverer1@smartwash.edu", password: "deliver123", icon: <Truck className="w-4 h-4 text-purple-500" /> },
    { role: "Deliverer Two", email: "deliverer2@smartwash.edu", password: "deliver234", icon: <Truck className="w-4 h-4 text-purple-500" /> },
  ];

  const [visiblePassword, setVisiblePassword] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null); // highlight clicked card

  const handleSelect = (account) => {
    setSelectedRole(account.role);
    onSelect(account); // autofill inputs in LoginForm

    // Remove highlight after 1 second
    setTimeout(() => setSelectedRole(null), 1000);
  };

  return (
    <div className="mt-8 p-4 bg-card border border-border rounded-xl shadow-md">
      <p className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
        Quick Autofill (Click a card)
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {demoAccounts.map((account) => (
          <div key={account.email} className="relative">
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(account)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSelect(account);
              }}
              className={`
                w-full p-3 rounded-lg border flex flex-col items-start
                cursor-pointer transition-all duration-200
                hover:scale-105 hover:shadow-lg
                ${selectedRole === account.role ? "bg-yellow-200 border-yellow-500 scale-105 shadow-lg" : "bg-background border-border"}
              `}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                {account.icon}
                {account.role}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{account.email}</div>

              {/* Password toggle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // prevent autofill
                  setVisiblePassword(visiblePassword === account.role ? null : account.role);
                }}
                className="absolute top-2 right-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center gap-1 hover:bg-primary/20 transition-colors"
              >
                <Eye className="w-3 h-3" />
                {visiblePassword === account.role ? account.password : "••••••••"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
