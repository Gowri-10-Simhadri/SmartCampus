"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import MobileBottomNav from "../../../components/MobileBottomNav";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../lib/api";
import {
  ArrowLeft,
  Send,
  MapPin,
  Tag,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Paperclip,
  ShieldAlert,
} from "lucide-react";

const CATEGORIES = [
  { label: "Electrical", icon: "💡", desc: "Lights, wiring, AC, switches" },
  { label: "Water", icon: "💧", desc: "Taps, filters, leaks, bathrooms" },
  { label: "Cleanliness", icon: "🧹", desc: "Hygiene, waste disposal, dust" },
  { label: "Internet", icon: "🌐", desc: "Wi-Fi, routers, Ethernet drops" },
  { label: "Infrastructure", icon: "🏗️", desc: "Doors, windows, benches, walls" },
  { label: "Classroom", icon: "🎓", desc: "Projectors, podium, sound, boards" },
  { label: "Hostel", icon: "🛏️", desc: "Dorm rooms, mess, water heaters" },
  { label: "Security", icon: "🛡️", desc: "Gates, ID checks, cameras, lighting" },
  { label: "Other", icon: "📋", desc: "General campus maintenance" },
];

const CAMPUS_PRESETS = [
  "Engineering Block A",
  "Computer Lab 3",
  "Central Library 2nd Floor",
  "Boys Hostel Block 1",
  "Girls Hostel Block 2",
  "Campus Cafeteria",
  "Sports Complex & Gym",
  "Main Auditorium",
];

const PRIORITIES = [
  { label: "Low", desc: "Minor nuisance", color: "border-slate-200 text-slate-700" },
  { label: "Medium", desc: "Standard priority", color: "border-blue-200 text-blue-700 bg-blue-50/50" },
  { label: "High", desc: "Impacting classes", color: "border-amber-200 text-amber-700 bg-amber-50/50" },
  { label: "Urgent", desc: "Safety / hazard", color: "border-rose-200 text-rose-700 bg-rose-50/50" },
];

export default function NewComplaintPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electrical");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category) {
      setError("Please fill out title, category, and description.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.complaints.create({
        title: title.trim(),
        description: description.trim(),
        category,
        location: location.trim() || "Main Campus",
        priority,
        imageUrl: imageUrl.trim() || undefined,
      });

      if (res.success) {
        setSuccess("Complaint submitted successfully! Live ticket generated.");
        setTimeout(() => {
          router.push("/complaints");
        }, 1200);
      } else {
        setError(res.message || "Failed to submit complaint.");
      }
    } catch (err: any) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 md:pb-12 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 shadow-sm active:scale-95 transition-all touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Report Campus Issue
            </h1>
            <p className="text-xs text-slate-500">
              Provide specific details to help facilities teams fix it faster
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Complaint Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Category Picker */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                1. Select Category *
              </label>
              <span className="text-xs text-blue-600 font-bold">{category}</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setCategory(cat.label)}
                  className={`p-3 rounded-2xl border text-left transition-all touch-manipulation active:scale-95 flex flex-col justify-between min-h-[75px] sm:min-h-[85px] ${
                    category === cat.label
                      ? "bg-blue-50/80 border-blue-500 text-blue-900 shadow-sm ring-1 ring-blue-500/30"
                      : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="text-xl sm:text-2xl mb-1">{cat.icon}</span>
                  <div>
                    <strong className="block text-xs font-bold leading-tight">
                      {cat.label}
                    </strong>
                    <span className="text-[10px] text-slate-400 hidden sm:block truncate">
                      {cat.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Complaint Core Details */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
              2. Problem Details *
            </label>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Complaint Title
              </label>
              <input
                type="text"
                required
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Broken fan in Room 302, Water tap leaking"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              />
              <div className="text-right text-[10px] text-slate-400 mt-1">
                {title.length}/120 characters
              </div>
            </div>

            {/* Location & Quick Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Specific Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Block B, Room 204 or Central Library"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                />
              </div>

              {/* Quick location chips */}
              <div className="flex gap-1.5 flex-wrap mt-2">
                <span className="text-[10px] font-bold text-slate-400 self-center">
                  Quick tag:
                </span>
                {CAMPUS_PRESETS.slice(0, 4).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setLocation(preset)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Description of the issue
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what's wrong, how long it has been broken, and any safety hazards..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium leading-relaxed"
              />
            </div>
          </div>

          {/* Card 3: Priority & Optional Image */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
              3. Priority Level & Media
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRIORITIES.map((pri) => (
                <button
                  key={pri.label}
                  type="button"
                  onClick={() => setPriority(pri.label)}
                  className={`p-3 rounded-2xl border text-center transition-all touch-manipulation active:scale-95 ${
                    priority === pri.label
                      ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <strong className="block text-xs font-bold">{pri.label}</strong>
                  <span className={`text-[10px] block opacity-80 truncate`}>
                    {pri.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Optional Photo Attachment Link */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                Photo URL / Attachment (Optional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-black text-sm sm:text-base shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all touch-manipulation"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Submit Campus Complaint</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </main>

      <MobileBottomNav />
    </div>
  );
}