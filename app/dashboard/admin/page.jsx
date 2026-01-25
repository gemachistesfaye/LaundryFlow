"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/dashboard/admin/admin-dashboard";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      console.log("No user/token → redirect to login");
      router.replace("/auth/login");
      return;
    }

    let userData;
    try {
      userData = JSON.parse(storedUser);
    } catch (e) {
      console.error("Failed to parse user data:", e);
      router.replace("/auth/login");
      return;
    }

    if (userData.role.toLowerCase() !== "admin") {
      console.log("User is not admin → redirect to login");
      router.replace("/auth/login");
      return;
    }

    console.log("Admin user loaded:", userData);
    setUser(userData);
    setLoading(false);

  }, [router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-lg font-medium text-gray-700">Loading Dashboard...</p>
      </div>
    );
  }

  return <AdminDashboard user={user} />;
}
