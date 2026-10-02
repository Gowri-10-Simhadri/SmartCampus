"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import MobileBottomNav from "../../components/MobileBottomNav";
import ComplaintDetailModal, { ComplaintDetail } from "../../components/ComplaintDetailModal";
import FilterBottomSheet from "../../components/FilterBottomSheet";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import {
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Calendar,
  Tag,
  ChevronRight,
  Clock,
  RotateCcw,
  AlertCircle,
  Inbox,
  Sparkles,
} from "lucide-react";

export default function ComplaintsPage() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  const [complaints, setComplaints] = useState<ComplaintDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintDetail | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadComplaints();
    }
  }, [isAuthenticated, statusFilter, categoryFilter, priorityFilter]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const fetchMethod = isAdmin
        ? api.admin.getComplaints
        : api.complaints.getMy;

      const res = await fetchMethod({
        search: search.trim() || undefined,
        status: statusFilter,
        category: categoryFilter,
        priority: priorityFilter,
      });

      if (res.success) {
        setComplaints(res.complaints || []);
      } else {
        setError(res.message || "Failed to load complaints");
      }
    } catch (err: any) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadComplaints();
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setPriorityFilter("All");
    setFilterModalOpen(false);
  };

  const activeFilterCount =
    (statusFilter !== "All" ? 1 : 0) +
    (categoryFilter !== "All" ? 1 : 0) +
    (priorityFilter !== "All" ? 1 : 0);

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
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
              SMARTCAMPUS DIRECTORY
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isAdmin ? "Campus Complaints Log" : "My Complaint History"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {isAdmin
                ? "Review, assign, and update all campus facility tickets"
                : "Track the status and timeline of all your submitted complaints"}
            </p>
          </div>

          {!isAdmin && (
            <Link
              href="/complaints/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all touch-manipulation"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue</span>
            </Link>
          )}
        </div>

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
              placeholder="Search by title, location, or ticket ID..."
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

        {/* Status Tab Chips */}
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

        {/* Complaints Listing */}
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
        ) : error ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto text-3xl">
              📭
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              No matching complaints found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search || activeFilterCount > 0
                ? "Try clearing your search keyword or relaxing your filter options."
                : "No complaints have been reported yet. Create a new one to get started!"}
            </p>
            {search || activeFilterCount > 0 ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Reset All Filters
              </button>
            ) : !isAdmin ? (
              <Link
                href="/complaints/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                <PlusCircle className="w-4 h-4" /> Report Issue
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {complaints.map((complaint) => {
              const badge = getStatusBadge(complaint.status);
              return (
                <article
                  key={complaint._id}
                  onClick={() => setSelectedComplaint(complaint)}
                  className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer group flex flex-col justify-between touch-manipulation active:scale-[0.99]"
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
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {complaint.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {complaint.description}
                      </p>
                    </div>

                    {/* Meta info tags */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[140px]">
                          {complaint.location || "Campus Grounds"}
                        </span>
                      </span>

                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(complaint.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Progress Step Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {complaint.timeline?.length || 1} update(s) logged
                    </span>

                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View Timeline <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <MobileBottomNav />

      {/* Filter Bottom Sheet for Mobile */}
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

      {/* Detail Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        isAdmin={isAdmin}
        onStatusUpdated={(updated) => {
          setComplaints((prev) =>
            prev.map((c) => (c._id === updated._id ? updated : c))
          );
          setSelectedComplaint(updated);
        }}
      />
    </div>
  );
}