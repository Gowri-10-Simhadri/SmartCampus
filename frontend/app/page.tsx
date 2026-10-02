"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import MobileBottomNav from "../components/MobileBottomNav";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  MapPin,
  Check,
  ChevronRight,
  Smartphone,
  Server,
  Activity,
  Users,
} from "lucide-react";

export default function Home() {
  const [activeDemoTab, setActiveDemoTab] = useState<"electrical" | "water" | "wifi">("electrical");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-20 md:pb-12">
        {/* HERO SECTION */}
        <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden">
          {/* Subtle background glow effects */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-gradient-to-tr from-blue-400/15 via-indigo-400/15 to-purple-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Value Proposition */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  NEXT-GEN CAMPUS MANAGEMENT
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                  Your Campus. <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Faster Solved.
                  </span> <br />
                  Better Connected.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Report infrastructure, water, cleanliness, and electrical issues in under 30 seconds. Track real-time progress on mobile and hold campus administration accountable.
                </p>

                {/* Call-to-action buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all touch-manipulation"
                  >
                    <span>Get Started as Student</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/80 font-bold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all touch-manipulation"
                  >
                    <span>Sign In</span>
                  </Link>
                </div>

                {/* Trust Metrics */}
                <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Instant Ticket Creation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <span>Role-Based Security</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    <span>Live Atlas Sync</span>
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Perspective Mobile Showcase */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[340px] sm:max-w-[380px] perspective-container">
                  {/* Floating badge 1 */}
                  <div className="absolute -top-4 -left-4 sm:-left-6 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float-slow">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base">
                      ✓
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900">Issue Resolved</p>
                      <p className="text-[10px] text-slate-400">Library AC fixed • 4m ago</p>
                    </div>
                  </div>

                  {/* Floating badge 2 */}
                  <div className="absolute -bottom-4 -right-4 sm:-right-6 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float-reverse">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base">
                      ⚡
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900">Assigned</p>
                      <p className="text-[10px] text-slate-400">Campus Electrical Dept</p>
                    </div>
                  </div>

                  {/* Main 3D Card Simulation */}
                  <div className="perspective-card-3d bg-white rounded-3xl p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] border border-slate-200/90 relative overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600">
                          SMARTCAMPUS APP
                        </span>
                        <h3 className="text-sm font-black text-slate-900">
                          Live Ticket Tracker
                        </h3>
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    {/* Interactive selector */}
                    <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl my-3 text-[11px] font-bold text-slate-600">
                      <button
                        type="button"
                        onClick={() => setActiveDemoTab("electrical")}
                        className={`flex-1 py-1.5 rounded-lg transition-all ${
                          activeDemoTab === "electrical"
                            ? "bg-white text-blue-600 shadow-sm"
                            : ""
                        }`}
                      >
                        💡 Lab 3 Fan
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveDemoTab("water")}
                        className={`flex-1 py-1.5 rounded-lg transition-all ${
                          activeDemoTab === "water"
                            ? "bg-white text-blue-600 shadow-sm"
                            : ""
                        }`}
                      >
                        💧 Block C Filter
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveDemoTab("wifi")}
                        className={`flex-1 py-1.5 rounded-lg transition-all ${
                          activeDemoTab === "wifi"
                            ? "bg-white text-blue-600 shadow-sm"
                            : ""
                        }`}
                      >
                        🌐 Hostel Wi-Fi
                      </button>
                    </div>

                    {/* Active simulated complaint card */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            #TKT-8941
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                            {activeDemoTab === "electrical"
                              ? "Ceiling fan rattling loudly in CS Lab"
                              : activeDemoTab === "water"
                              ? "Drinking water tap dripping in Block C"
                              : "High latency on 4th floor access point"}
                          </h4>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                            activeDemoTab === "water"
                              ? "bg-emerald-100 text-emerald-700"
                              : activeDemoTab === "electrical"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {activeDemoTab === "water"
                            ? "Resolved"
                            : activeDemoTab === "electrical"
                            ? "In Progress"
                            : "Pending"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {activeDemoTab === "electrical"
                            ? "Academic Block A, Lab 204"
                            : activeDemoTab === "water"
                            ? "Block C 2nd Floor"
                            : "Hostel 2 Wing B"}
                        </span>
                      </div>

                      {/* Mini Timeline steps */}
                      <div className="pt-2 border-t border-slate-200/70 space-y-1.5">
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">
                            ✓
                          </span>
                          <span className="font-semibold text-slate-800">Submitted</span>
                          <span className="text-slate-400 ml-auto">10:15 AM</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                              activeDemoTab !== "wifi"
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {activeDemoTab !== "wifi" ? "✓" : "2"}
                          </span>
                          <span className="font-semibold text-slate-800">
                            Technician Assigned
                          </span>
                          <span className="text-slate-400 ml-auto">11:30 AM</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                              activeDemoTab === "water"
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {activeDemoTab === "water" ? "✓" : "3"}
                          </span>
                          <span className="font-semibold text-slate-800">
                            Issue Fixed & Verified
                          </span>
                          <span className="text-slate-400 ml-auto">
                            {activeDemoTab === "water" ? "01:45 PM" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-blue-600">
                        <Smartphone className="w-3.5 h-3.5" /> Mobile Optimized
                      </span>
                      <span>Verified on Atlas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-16 bg-white border-y border-slate-100" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                WHY SMARTCAMPUS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1">
                Built specifically for real campus life.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Say goodbye to lost paper complaints, chaotic WhatsApp groups, and unanswered college emails.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                  📝
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">
                  Fast 30-Second Reporting
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Select a category, snap a location tag, write what's broken, and tap submit right from your smartphone.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                  📊
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">
                  Live Status Timelines
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Clear step-by-step progression: Submitted → Under Review → Assigned → In Progress → Resolved. No guesswork.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                  🛡️
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">
                  Dedicated Admin Console
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Staff and facility managers filter complaints by priority and category, assign teams, and post resolution updates.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                  🔔
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">
                  Real-Time Notifications
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Students get notified the moment their complaint is assigned, updated by a technician, or officially resolved.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                  ☁️
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">
                  MongoDB Atlas Cloud
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  High-availability cloud database with automated replication, schema validation, and secure authentication.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                  📱
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">
                  100% Mobile First
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Tailored touch targets, bottom navigation, bottom sheets, and responsive typography built for all phone screen sizes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-16 bg-slate-50" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                SIMPLE 3-STEP PROCESS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1">
                From problem to resolution.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
                <span className="text-3xl font-black text-blue-100 absolute top-4 right-4">
                  01
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center mb-4">
                  1
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">
                  Submit with Location
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Student selects problem category (Electrical, Water, Internet, etc.) and specifies exact room or campus block.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
                <span className="text-3xl font-black text-indigo-100 absolute top-4 right-4">
                  02
                </span>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center mb-4">
                  2
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">
                  Admin Reviews & Assigns
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Facilities admin verifies the ticket, prioritizes urgency, and assigns it directly to the relevant campus team.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
                <span className="text-3xl font-black text-emerald-100 absolute top-4 right-4">
                  03
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center mb-4">
                  3
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">
                  Fixed & Confirmed
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Technician completes the repair, resolution notes are added, and the student receives an instant confirmation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="about">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl shadow-blue-500/20 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-3 py-1 rounded-full">
                READY TO EXPERIENCE SMARTCAMPUS?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                Make your campus cleaner, safer & smarter today.
              </h2>
              <p className="text-xs sm:text-sm text-blue-100">
                Sign in with your campus account or try the live demo accounts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/login"
                className="px-6 py-3 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 active:scale-95 transition-all text-center shadow-md"
              >
                Sign In Now →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              S
            </div>
            <strong className="text-slate-800">SmartCampus</strong>
            <span>— Campus Facility & Complaint Management</span>
          </div>
          <p>© 2026 SmartCampus Platform. All rights reserved.</p>
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
}