"use client";

import { useState } from "react";
import { Users, ShoppingCart, DollarSign, BarChart3, Settings } from "lucide-react";
import { UserManagement } from "./user-management";
import { OrderManagement } from "./order-management";
import { FinancialReports } from "./financial-reports";
import { SystemSettings } from "./system-settings";
import { AnalyticsOverview } from "./analytics-overview";

export function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("overview");

  // You can add counts dynamically from API if needed
  const tabCounts = {
    users: 12,
    orders: 8,
    finances: 3,
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users, count: tabCounts.users },
    { id: "orders", label: "Orders", icon: ShoppingCart, count: tabCounts.orders },
    { id: "finances", label: "Finances", icon: DollarSign, count: tabCounts.finances },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <main className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Full system control and management</p>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-lg mb-8">
        <div className="flex overflow-x-auto border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  isActive
                    ? "text-primary border-b-primary"
                    : "text-muted-foreground border-b-transparent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>

                {tab.count !== undefined && (
                  <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === "overview" && <AnalyticsOverview />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "orders" && <OrderManagement />}
          {activeTab === "finances" && <FinancialReports />}
          {activeTab === "settings" && <SystemSettings />}
        </div>
      </div>
    </main>
  );
}
