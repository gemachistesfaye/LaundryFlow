"use client";

import { useRouter } from "next/navigation";
import LandingNavbar from "@/components/LandingNavbar";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const router = useRouter();

const handleLoginSuccess = (user, token) => {
  console.log("Login successful:", user.role);
  const normalizedRole = user.role.toLowerCase().replace(/\s+/g, "-");
  router.push(`/dashboard/${normalizedRole}`);
};

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-24">
      <LandingNavbar />

      <div className="flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            Login
          </h1>

          <LoginForm 
            onLogin={handleLoginSuccess} 
            switchToRegister={() => router.push("/auth/register")}
          />
        </div>
      </div>
    </div>
  );
}
