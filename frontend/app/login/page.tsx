"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  User,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await login(email, password);
      if (res.success) {
        // Retrieve fresh user from localStorage to redirect accurately
        const saved = localStorage.getItem("user");
        const parsed = saved ? JSON.parse(saved) : null;
        if (parsed?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(res.message || "Invalid email or password.");
      }
    } catch (err: any) {
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Account Helpers for effortless testing
  const fillStudentDemo = () => {
    setEmail("student@smartcampus.com");
    setPassword("Student@12345");
    setError("");
  };

  const fillAdminDemo = () => {
    setEmail("admin@smartcampus.com");
    setPassword("Admin@12345");
    setError("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-[420px] bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-200/90 relative">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl shadow-lg shadow-blue-500/25 mb-3 group hover:scale-105 active:scale-95 transition-transform"
          >
            S
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Sign in to manage your campus tickets
          </p>
        </div>

        {/* Demo Fast-Fill Pills */}
        <div className="mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1 text-blue-600">
              <Sparkles className="w-3.5 h-3.5" /> Instant Demo Fill
            </span>
            <span>Tap to test</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillStudentDemo}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all touch-manipulation"
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Student Demo</span>
            </button>
            <button
              type="button"
              onClick={fillAdminDemo}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all touch-manipulation"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Campus Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@smartcampus.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 touch-manipulation"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all touch-manipulation mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-xs text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-bold hover:underline"
            >
              Create Student Account
            </Link>
          </p>

          <Link
            href="/"
            className="inline-block text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}