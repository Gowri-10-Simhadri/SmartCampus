"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import MobileBottomNav from "../../components/MobileBottomNav";
import ComplaintDetailModal, { ComplaintDetail } from "../../components/ComplaintDetailModal";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  MapPin,
  Tag,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Inbox,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [complaints, setComplaints] = useState<ComplaintDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintDetail | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      loadComplaints();
    }
  }, [isLoading, isAuthenticated, router]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.complaints.getMy();
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      console.error("Failed to load complaints:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadComplaints();
  };

  const pendingCount = complaints.filter(
    (c) => c.status === "Pending" || c.status === "Under Review"
  ).length;

  const inProgressCount = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolvedCount = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Resolved":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "In Progress":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500",
        };
      case "Under Review":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          dot: "bg-purple-500",
        };
      case "Rejected":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          dot: "bg-rose-500",
        };
      default:
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 md:pb-12 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 content-container py-8 space-y-8">
        {/* Welcome Banner Card */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase text-blue-100 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Student Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Good day, {user?.name?.split(" ")[0] || "Student"} 👋
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-md">
                Monitor live maintenance tickets and report any campus issues in real time.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleRefresh}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white backdrop-blur-md transition-all touch-manipulation"
                title="Refresh complaints"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>

              <Link
                href="/complaints/new"
                className="px-5 py-3 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all touch-manipulation flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Issue</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3D KPI Metrics Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 perspective-container">
          {/* Card 1: Total */}
          <div className="perspective-card-3d bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Filed
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                📋
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {loading ? "--" : complaints.length}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Lifetime tickets</span>
            </span>
          </div>

          {/* Card 2: Pending */}
          <div className="perspective-card-3d bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                Pending
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                ⏳
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">
              {loading ? "--" : pendingCount}
            </div>
            <span className="text-[10px] text-amber-600/80 mt-1 flex items-center gap-1">
              <span>Awaiting review</span>
            </span>
          </div>

          {/* Card 3: In Progress */}
          <div className="perspective-card-3d bg-white rounded-2xl p-4 sm:p-5 border border-blue-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                In Progress
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                🔧
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600">
              {loading ? "--" : inProgressCount}
            </div>
            <span className="text-[10px] text-blue-600/80 mt-1 flex items-center gap-1">
              <span>Technician active</span>
            </span>
          </div>

          {/* Card 4: Resolved */}
          <div className="perspective-card-3d bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Resolved
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                ✅
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {loading ? "--" : resolvedCount}
            </div>
            <span className="text-[10px] text-emerald-600/80 mt-1 flex items-center gap-1">
              <span>Successfully closed</span>
            </span>
          </div>
        </section>

        {/* Quick Action Shortcuts */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Link
            href="/complaints/new"
            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between group touch-manipulation active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                ✍️
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  Report New Campus Issue
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Electrical, water, WiFi, hygiene, or classroom
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/complaints"
            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group touch-manipulation active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                🗂️
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  View Complaint History
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Search, filter, and track all your past tickets
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </section>

        {/* Recent Complaints Section */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Recent Campus Reports
              </h2>
              <p className="text-xs text-slate-500">
                Tap on any ticket to view its full live timeline
              </p>
            </div>

            <Link
              href="/complaints"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 active:scale-95 transition-all"
            >
              <span>View all ({complaints.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 py-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-18 bg-slate-100/70 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto text-2xl">
                📭
              </div>
              <h3 className="font-bold text-sm text-slate-800">
                No complaints submitted yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Everything looks smooth on campus! If something is broken, report it now to alert facility teams.
              </p>
              <Link
                href="/complaints/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Submit First Complaint
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {complaints.slice(0, 5).map((complaint) => {
                const badge = getStatusBadge(complaint.status);
                return (
                  <div
                    key={complaint._id}
                    onClick={() => setSelectedComplaint(complaint)}
                    className="py-3.5 sm:py-4 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50/80 -mx-2 px-2 rounded-2xl transition-colors touch-manipulation"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-base font-bold group-hover:scale-105 transition-transform">
                        {complaint.category === "Electrical"
                          ? "💡"
                          : complaint.category === "Water"
                          ? "💧"
                          : complaint.category === "Internet"
                          ? "🌐"
                          : complaint.category === "Cleanliness"
                          ? "🧹"
                          : complaint.category === "Security"
                          ? "🛡️"
                          : "📋"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            #{complaint._id.slice(-6).toUpperCase()}
                          </span>
                          <span className="text-[10px] font-medium text-slate-500">
                            • {complaint.category}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {complaint.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1 truncate max-w-[180px]">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {complaint.location || "Campus"}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(complaint.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border ${badge.bg} flex items-center gap-1.5`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {complaint.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors hidden sm:inline" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <MobileBottomNav />

      {/* Interactive Detail Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
      />
    </div>
  );
}