"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, BarChart3, Users } from "lucide-react";
import { OrderApprovalPanel } from "./order-approval-panel";
import { AssignmentPanel } from "./assignment-panel";
import { NotificationsPanel } from "./notifications-panel";
import { AuditLogs } from "./audit-logs";

export function CoordinatorDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("approvals");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Mock sample data (replace with backend)
      setOrders([
        {
          id: "1",
          studentName: "John Doe",
          items: "3 bags",
          quantity: 3,
          status: "pending_coordinator_approval",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          notes: "Delicate fabrics",
        },
        {
          id: "2",
          studentName: "Jane Smith",
          items: "2 bags",
          quantity: 2,
          status: "waiting_worker_assignment",
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          assignedWorker: null,
          assignedDeliverer: null,
        },
        {
          id: "3",
          studentName: "Mike Johnson",
          items: "1 bag",
          quantity: 1,
          status: "waiting_worker_confirmation",
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
          assignedWorker: "Worker #1",
        },
      ]);

    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Dashboard stats
  const stats = {
    pending: orders.filter((o) => o.status === "pending_coordinator_approval").length,
    approved: orders.filter((o) => o.status.includes("waiting")).length,
    completed: 15,
    totalOrders: orders.length,
  };

  const tabs = [
    { id: "approvals", label: "Approvals", icon: CheckCircle, count: stats.pending },
    { id: "assignments", label: "Assignments", icon: Users, count: stats.approved },
    { id: "notifications", label: "Notifications", icon: Clock },
    { id: "logs", label: "Audit Logs", icon: BarChart3 },
  ];

  return (
    <main className="max-w-7xl mx-auto p-6">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Pending Approvals</div>
              <div className="text-3xl font-bold text-foreground">{stats.pending}</div>
            </div>
            <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Waiting Assignment</div>
              <div className="text-3xl font-bold text-foreground">{stats.approved}</div>
            </div>
            <Users className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Completed (Today)</div>
              <div className="text-3xl font-bold text-foreground">8</div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
              <div className="text-3xl font-bold text-foreground">{stats.totalOrders}</div>
            </div>
            <BarChart3 className="h-8 w-8 text-primary opacity-50" />
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-lg mb-8">
        <div className="flex border-b border-border">

          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
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
          {activeTab === "approvals" && <OrderApprovalPanel orders={orders} onOrdersUpdated={fetchOrders} />}
          {activeTab === "assignments" && <AssignmentPanel orders={orders} onOrdersUpdated={fetchOrders} />}
          {activeTab === "notifications" && <NotificationsPanel />}
          {activeTab === "logs" && <AuditLogs />}
        </div>
      </div>
    </main>
  );
}
