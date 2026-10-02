"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import MobileBottomNav from "../../components/MobileBottomNav";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import {
  User,
  Mail,
  Shield,
  LogOut,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Lock,
  ChevronRight,
  Database,
  Smartphone,
  AlertCircle,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isAdmin, logout, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userStats, setUserStats] = useState({ total: 0, pending: 0, resolved: 0 });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      setName(user.name || "");
      // Fetch complaint counts
      const fetchMethod = isAdmin ? api.admin.getComplaints : api.complaints.getMy;
      fetchMethod().then((res) => {
        if (res.success && res.complaints) {
          const list = res.complaints;
          setUserStats({
            total: list.length,
            pending: list.filter((c: any) => c.status === "Pending" || c.status === "Under Review").length,
            resolved: list.filter((c: any) => c.status === "Resolved").length,
          });
        }
      });
    }
  }, [isLoading, isAuthenticated, user, router, isAdmin]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage("");
    setError("");

    try {
      const res = await api.auth.updateProfile({
        name: name.trim(),
        password: newPassword ? newPassword.trim() : undefined,
      });

      if (res.success && res.user) {
        updateUser(res.user);
        setMessage("Profile updated successfully!");
        setNewPassword("");
      } else {
        setError(res.message || "Failed to update profile");
      }
    } catch (err: any) {
      setError(err.message || "Error updating profile");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 md:pb-12 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Profile Card */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                {isAdmin ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-blue-600" />
                    Administrator
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    Verified Student
                  </>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {user?.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {user?.email}
              </p>
            </div>
          </div>

          {/* Quick Metrics for User */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Total Tickets
              </span>
              <strong className="text-lg font-black text-slate-900">
                {userStats.total}
              </strong>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">
                Pending
              </span>
              <strong className="text-lg font-black text-amber-600">
                {userStats.pending}
              </strong>
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                Resolved
              </span>
              <strong className="text-lg font-black text-emerald-600">
                {userStats.resolved}
              </strong>
            </div>
          </div>
        </section>

        {/* Update Profile Form */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
            Account Settings
          </h2>

          {message && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                New Password (leave empty to keep current)
              </label>
              <input
                type="password"
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 touch-manipulation"
            >
              {updating ? "Saving Changes..." : "Update Profile"}
            </button>
          </form>
        </section>

        {/* System & Connection Status */}
        <section className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              Database Engine
            </span>
            <span className="font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              MongoDB Atlas Cloud
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="font-bold text-slate-800 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              Application Mode
            </span>
            <span className="font-medium text-slate-600">
              Mobile-First PWA Responsive
            </span>
          </div>
        </section>

        {/* Logout Action */}
        <section className="pt-2">
          <button
            type="button"
            onClick={logout}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all touch-manipulation"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of SmartCampus</span>
          </button>
        </section>
      </main>

      <MobileBottomNav />
    </div>
  );
}
