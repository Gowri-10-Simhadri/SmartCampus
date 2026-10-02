"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import MobileBottomNav from "../../components/MobileBottomNav";
import ComplaintDetailModal, { ComplaintDetail } from "../../components/ComplaintDetailModal";
import FilterBottomSheet from "../../components/FilterBottomSheet";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import {
  Shield,
  Activity,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  BarChart3,
  TrendingUp,
  MapPin,
  Tag,
  User,
  Building,
  RefreshCw,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface AdminStats {
  total: number;
  pending: number;
  underReview: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  resolutionRate: number;
  categoryStats: { _id: string; count: number }[];
  priorityStats: { _id: string; count: number }[];
  recentActivity: ComplaintDetail[];
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();

  const [activeView, setActiveView] = useState<"overview" | "complaints">("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [complaints, setComplaints] = useState<ComplaintDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintDetail | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      if (!isAdmin) {
        router.push("/dashboard");
        return;
      }
      loadAllAdminData();
    }
  }, [isLoading, isAuthenticated, isAdmin, router, statusFilter, categoryFilter, priorityFilter]);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, complaintsRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getComplaints({
          search: search.trim() || undefined,
          status: statusFilter,
          category: categoryFilter,
          priority: priorityFilter,
        }),
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      if (complaintsRes.success) {
        setComplaints(complaintsRes.complaints || []);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAllAdminData();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.admin
      .getComplaints({
        search: search.trim() || undefined,
        status: statusFilter,
        category: categoryFilter,
        priority: priorityFilter,
      })
      .then((res) => {
        if (res.success) setComplaints(res.complaints || []);
      });
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setPriorityFilter("All");
    setFilterModalOpen(false);
  };

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

  const activeFilterCount =
    (statusFilter !== "All" ? 1 : 0) +
    (categoryFilter !== "All" ? 1 : 0) +
    (priorityFilter !== "All" ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 md:pb-12 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 content-container py-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold tracking-wide uppercase mb-1">
              <Shield className="w-3.5 h-3.5" />
              Administrative Control Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Campus Facilities Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Live MongoDB Atlas metrics, ticket routing, and status resolution
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 shadow-sm transition-all touch-manipulation flex items-center gap-1.5 text-xs font-bold"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveView("overview")}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeView === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview & Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("complaints")}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeView === "complaints"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Manage Complaints ({complaints.length})</span>
          </button>
        </div>

        {/* VIEW 1: OVERVIEW & ANALYTICS */}
        {activeView === "overview" && (
          <div className="space-y-6">
            {/* 3D KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 perspective-container">
              {/* Card 1: Total */}
              <div className="perspective-card-3d bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Complaints
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 my-1">
                  {stats?.total ?? (loading ? "--" : 0)}
                </div>
                <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                  <Activity className="w-3 h-3 text-blue-600" />
                  Live campus reports
                </span>
              </div>

              {/* Card 2: Pending + Under Review */}
              <div className="perspective-card-3d bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/90 shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                  Pending Review
                </span>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 my-1">
                  {(stats?.pending || 0) + (stats?.underReview || 0)}
                </div>
                <span className="text-[10px] text-amber-700 flex items-center gap-1 font-semibold">
                  <span>Action required</span>
                </span>
              </div>

              {/* Card 3: In Progress */}
              <div className="perspective-card-3d bg-white rounded-2xl p-4 sm:p-5 border border-blue-200/90 shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                  In Progress
                </span>
                <div className="text-2xl sm:text-3xl font-black text-blue-600 my-1">
                  {stats?.inProgress ?? (loading ? "--" : 0)}
                </div>
                <span className="text-[10px] text-blue-700 flex items-center gap-1 font-semibold">
                  <span>Technicians assigned</span>
                </span>
              </div>

              {/* Card 4: Resolution Rate */}
              <div className="perspective-card-3d bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200/90 shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Resolution Rate
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 my-1">
                  {stats?.resolutionRate ?? (loading ? "--" : 0)}%
                </div>
                <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
                  <span>{stats?.resolved || 0} tickets resolved</span>
                </span>
              </div>
            </div>

            {/* Visual Breakdown Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution Bar Chart */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Category Distribution
                    </h3>
                    <p className="text-xs text-slate-500">
                      Volume of campus tickets by domain
                    </p>
                  </div>
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>

                <div className="space-y-3 pt-2">
                  {stats?.categoryStats && stats.categoryStats.length > 0 ? (
                    stats.categoryStats.map((cat) => {
                      const percentage =
                        stats.total > 0
                          ? Math.round((cat.count / stats.total) * 100)
                          : 0;
                      return (
                        <div key={cat._id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>{cat._id}</span>
                            <span>
                              {cat.count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No category statistics available yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Status Flow Progress */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Resolution Pipeline
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pipeline state breakdown across campus
                    </p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { label: "Pending", count: stats?.pending || 0, color: "bg-amber-500" },
                    { label: "Under Review", count: stats?.underReview || 0, color: "bg-purple-500" },
                    { label: "In Progress", count: stats?.inProgress || 0, color: "bg-blue-500" },
                    { label: "Resolved", count: stats?.resolved || 0, color: "bg-emerald-500" },
                    { label: "Rejected", count: stats?.rejected || 0, color: "bg-rose-500" },
                  ].map((pipe) => {
                    const percentage =
                      stats?.total && stats.total > 0
                        ? Math.round((pipe.count / stats.total) * 100)
                        : 0;
                    return (
                      <div key={pipe.label} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>{pipe.label}</span>
                          <span>
                            {pipe.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${pipe.color} rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Action Link to Complaints */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveView("complaints")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all active:scale-95"
              >
                <span>Jump to Complaint Management</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: COMPLAINTS MANAGEMENT */}
        {activeView === "complaints" && (
          <div className="space-y-4">
            {/* Search & Mobile Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, location, or assigned staff..."
                  className="w-full pl-10 pr-20 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute inset-y-1.5 right-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setFilterModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm active:scale-95 transition-all touch-manipulation relative"
              >
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
              {["All", "Pending", "Under Review", "In Progress", "Resolved", "Rejected"].map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3.5 py-2 rounded-xl border transition-all whitespace-nowrap touch-manipulation active:scale-95 ${
                      statusFilter === st
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-2.5 py-2 text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 whitespace-nowrap"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Complaints List / Responsive Cards */}
            {loading ? (
              <div className="space-y-3 py-6">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-24 bg-white rounded-3xl border border-slate-100 p-4 animate-pulse flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <div className="w-1/3 h-4 bg-slate-100 rounded" />
                      <div className="w-1/2 h-3 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : complaints.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto text-3xl">
                  📭
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  No complaints found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search criteria or resetting filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {complaints.map((complaint) => {
                  const badge = getStatusBadge(complaint.status);
                  return (
                    <article
                      key={complaint._id}
                      onClick={() => setSelectedComplaint(complaint)}
                      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-pointer group flex flex-col justify-between touch-manipulation active:scale-[0.99]"
                    >
                      <div className="space-y-3">
                        {/* Top Row: Ticket ID, Category & Status */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              #{complaint._id.slice(-6).toUpperCase()}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">
                              {complaint.category}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.bg} flex items-center gap-1.5`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            {complaint.status}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {complaint.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {complaint.description}
                          </p>
                        </div>

                        {/* Location, Student info & Assigned team */}
                        <div className="space-y-1.5 pt-1 text-[11px] text-slate-500">
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{complaint.location || "Campus Grounds"}</span>
                            </span>
                            <span className="text-slate-400">
                              {new Date(complaint.createdAt).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 text-[10px] bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="flex items-center gap-1 truncate">
                              <User className="w-3 h-3 text-blue-500" />
                              <strong className="text-slate-700 truncate">
                                {complaint.student?.name || "Student"}
                              </strong>
                            </span>
                            <span className="flex items-center gap-1 text-indigo-600 font-semibold truncate">
                              <Building className="w-3 h-3" />
                              <span className="truncate">{complaint.assignedTo || "Unassigned"}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-semibold text-slate-400">
                          {complaint.timeline?.length || 1} update(s)
                        </span>

                        <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Review & Update <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <MobileBottomNav />

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        status={statusFilter}
        setStatus={setStatusFilter}
        category={categoryFilter}
        setCategory={setCategoryFilter}
        priority={priorityFilter}
        setPriority={setPriorityFilter}
        onReset={handleResetFilters}
      />

      {/* Complaint Detail & Admin Action Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        isAdmin={true}
        onStatusUpdated={(updated) => {
          setComplaints((prev) =>
            prev.map((c) => (c._id === updated._id ? updated : c))
          );
          setSelectedComplaint(updated);
          // reload statistics
          api.admin.getStats().then((res) => {
            if (res.success) setStats(res.stats);
          });
        }}
      />
    </div>
  );
}