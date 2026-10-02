"use client";

import React, { useState } from "react";
import {
  X,
  MapPin,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  User,
  Shield,
  Tag,
  ArrowRight,
  Send,
  MessageSquare,
  FileText,
  Building,
} from "lucide-react";
import { api } from "../lib/api";

interface TimelineEvent {
  status: string;
  comment?: string;
  updatedBy?: string;
  timestamp: string;
}

export interface ComplaintDetail {
  _id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  priority?: string;
  status: string;
  assignedTo?: string;
  imageUrl?: string;
  resolutionNotes?: string;
  createdAt: string;
  student?: {
    _id: string;
    name: string;
    email: string;
  };
  timeline?: TimelineEvent[];
}

interface ComplaintDetailModalProps {
  complaint: ComplaintDetail | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onStatusUpdated?: (updated: ComplaintDetail) => void;
}

export default function ComplaintDetailModal({
  complaint,
  isOpen,
  onClose,
  isAdmin = false,
  onStatusUpdated,
}: ComplaintDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "timeline" | "adminAction">(
    "details"
  );
  const [newStatus, setNewStatus] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [resolutionNotes, setResolutionNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");

  if (!isOpen || !complaint) return null;

  const currentStatus = complaint.status;

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

  const statusStyle = getStatusBadge(currentStatus);

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "High":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Low":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus) return;

    setSubmitting(true);
    setActionSuccess("");
    setActionError("");

    try {
      const res = await api.admin.updateStatus(complaint._id, {
        status: newStatus,
        comment,
        resolutionNotes: newStatus === "Resolved" ? resolutionNotes : undefined,
      });

      if (res.success && res.complaint) {
        setActionSuccess(`Status updated to "${newStatus}"!`);
        if (onStatusUpdated) onStatusUpdated(res.complaint);
        setComment("");
        setResolutionNotes("");
      } else {
        setActionError(res.message || "Failed to update status");
      }
    } catch (err: any) {
      setActionError(err.message || "Error updating status");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedTo) return;

    setSubmitting(true);
    setActionSuccess("");
    setActionError("");

    try {
      const res = await api.admin.assign(complaint._id, {
        assignedTo,
        comment: comment || `Assigned to ${assignedTo}`,
      });

      if (res.success && res.complaint) {
        setActionSuccess(`Assigned to "${assignedTo}"!`);
        if (onStatusUpdated) onStatusUpdated(res.complaint);
        setComment("");
      } else {
        setActionError(res.message || "Failed to assign staff");
      }
    } catch (err: any) {
      setActionError(err.message || "Error assigning staff");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                #{complaint._id.slice(-6).toUpperCase()}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusStyle.bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                {complaint.status}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityBadge(
                  complaint.priority
                )}`}
              >
                {complaint.priority || "Medium"} Priority
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              {complaint.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 px-4 sm:px-6 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === "details"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === "timeline"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Timeline & History ({complaint.timeline?.length || 1})
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab("adminAction")}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeTab === "adminAction"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              ⚡ Manage / Resolve
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === "details" && (
            <>
              {/* Description */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {complaint.description}
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CATEGORY</span>
                    <strong className="text-slate-800 text-xs">
                      {complaint.category}
                    </strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">LOCATION</span>
                    <strong className="text-slate-800 text-xs">
                      {complaint.location || "Campus Grounds"}
                    </strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">SUBMITTED ON</span>
                    <strong className="text-slate-800 text-xs">
                      {new Date(complaint.createdAt).toLocaleDateString([], {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ASSIGNED TEAM</span>
                    <strong className="text-slate-800 text-xs">
                      {complaint.assignedTo || "Unassigned"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Student Owner Info (if visible to admin) */}
              {complaint.student && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 text-xs">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-slate-500">Reported by:</span>{" "}
                    <strong className="text-slate-800">{complaint.student.name}</strong>{" "}
                    <span className="text-slate-400">({complaint.student.email})</span>
                  </div>
                </div>
              )}

              {/* Resolution Info if available */}
              {complaint.resolutionNotes && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Resolution Summary
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    {complaint.resolutionNotes}
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Event Progress History
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {complaint.timeline && complaint.timeline.length > 0 ? (
                  complaint.timeline.map((event, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {event.status}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(event.timestamp).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {event.comment && (
                          <p className="text-xs text-slate-600 mt-1">
                            {event.comment}
                          </p>
                        )}
                        <span className="inline-block mt-1 text-[10px] text-slate-400">
                          By: {event.updatedBy || "System"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-bold text-xs text-slate-900">
                        Complaint Submitted
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Received by SmartCampus system
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "adminAction" && isAdmin && (
            <div className="space-y-6">
              {actionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {actionSuccess}
                </div>
              )}

              {actionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  {actionError}
                </div>
              )}

              {/* Status Update Form */}
              <form onSubmit={handleUpdateStatus} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  Update Status & Progress
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["Pending", "Under Review", "In Progress", "Resolved", "Rejected"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewStatus(st)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center touch-manipulation ${
                        (newStatus || currentStatus) === st
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Progress Note / Comment
                  </label>
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="e.g. Technician dispatched to inspect wiring..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {newStatus === "Resolved" && (
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-700 mb-1">
                      Resolution Notes
                    </label>
                    <textarea
                      rows={2}
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Detail how the issue was fixed..."
                      className="w-full text-xs p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !newStatus || newStatus === currentStatus}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  {submitting ? "Saving..." : "Apply Status Update"}
                </button>
              </form>

              {/* Assignment Form */}
              <form onSubmit={handleAssign} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  Assign Department or Officer
                </h4>

                <div className="flex gap-2">
                  <select
                    value={assignedTo || complaint.assignedTo || ""}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select Department / Staff</option>
                    <option value="Campus Electrical Dept">Campus Electrical Dept</option>
                    <option value="Plumbing & Water Services">Plumbing & Water Services</option>
                    <option value="Campus IT & Wi-Fi Support">Campus IT & Wi-Fi Support</option>
                    <option value="Housekeeping & Sanitation">Housekeeping & Sanitation</option>
                    <option value="Civil Infrastructure Team">Civil Infrastructure Team</option>
                    <option value="Campus Security Wing">Campus Security Wing</option>
                    <option value="Hostel Warden Office">Hostel Warden Office</option>
                  </select>

                  <button
                    type="submit"
                    disabled={submitting || !assignedTo}
                    className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
                  >
                    Assign
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Ticket ID: {complaint._id}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-slate-700 active:scale-95 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
