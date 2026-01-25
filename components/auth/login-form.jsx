"use client";

import { useState, useRef } from "react";
import { Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoCredentials } from "./demo-credentials";

export function LoginForm({ switchToRegister, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [highlight, setHighlight] = useState(false);

  // Manual login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed.");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // 🔹 Trigger redirect in parent
      if (onLogin) onLogin(data.user, data.token);

    } catch (err) {
      console.error("Login error:", err);
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  // Demo autofill handler
  const handleDemoSelect = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setShowPassword(false);
    setError("");
    setHighlight(true);

    // Focus email input
    emailRef.current?.focus();

    setTimeout(() => setHighlight(false), 1000);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleLogin} className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="relative">
            <Input
              ref={emailRef}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pr-10 transition-all duration-300 ${
                highlight ? "bg-yellow-100 border-yellow-400" : ""
              }`}
            />
            <Mail className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <Input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pr-10 transition-all duration-300 ${
                highlight ? "bg-yellow-100 border-yellow-400" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* DEMO CREDENTIALS */}
      <DemoCredentials onSelect={handleDemoSelect} />
    </div>
  );
}
