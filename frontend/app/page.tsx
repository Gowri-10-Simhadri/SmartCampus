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
  Layers,
  MapPin,
  Check,
  ChevronRight,
  Smartphone,
  Database,
  Activity,
  FileText,
  Bell,
  CheckCheck,
  Send,
  Wrench,
} from "lucide-react";

export default function Home() {
  const [activeDemoTab, setActiveDemoTab] = useState<"electrical" | "water" | "wifi">("electrical");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-16">
        {/* =================================================================
            HERO SECTION
            Spacious, balanced 2-column layout on desktop, clean vertical on mobile
           ================================================================= */}
        <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden">
          {/* Subtle Ambient Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-gradient-to-tr from-blue-400/10 via-indigo-400/10 to-violet-400/5 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="content-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Heading, Value Proposition & Actions */}
              <div className="lg:col-span-7 text-center lg:text-left">
                {/* Eyebrow Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/70 text-blue-700 text-xs font-bold tracking-wider mb-6 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  NEXT-GEN CAMPUS MANAGEMENT
                </div>

                {/* Controlled Responsive Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-black text-slate-900 tracking-tight leading-[1.12] sm:leading-[1.12]">
                  Your Campus. <br />
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Faster Solved.
                  </span> <br />
                  Better Connected.
                </h1>

                {/* Hero Description */}
                <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-[560px] mx-auto lg:mx-0 leading-[1.65] font-normal">
                  Report infrastructure, water, cleanliness, and electrical issues in under 30 seconds. Track real-time progress on mobile and hold campus administration accountable.
                </p>

                {/* CTA Buttons Group */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8 pt-1">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 active:scale-95 transition-all touch-manipulation min-h-[48px]"
                  >
                    <span>Get Started as Student</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-base shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all touch-manipulation min-h-[48px]"
                  >
                    <span>Sign In</span>
                  </Link>
                </div>

                {/* Feature Indicators Row */}
                <div className="mt-10 pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-xs sm:text-sm font-medium text-slate-500 border-t border-slate-200/60 lg:border-t-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Instant Ticket Creation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Role-Based Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Live Atlas Sync</span>
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Product Visualization with Layered Cards */}
              <div className="lg:col-span-5 flex justify-center mt-6 lg:mt-0">
                <div className="relative w-full max-w-[360px] sm:max-w-[420px] perspective-container py-4">
                  
                  {/* Floating Micro-Card 1: Top-Left */}
                  <div className="absolute -top-2 -left-3 sm:-left-6 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float-slow">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base shadow-xs">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Issue Resolved</p>
                      <p className="text-[11px] text-slate-400">Library AC fixed • 4m ago</p>
                    </div>
                  </div>

                  {/* Floating Micro-Card 2: Bottom-Right */}
                  <div className="absolute -bottom-3 -right-3 sm:-right-6 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float-reverse">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base shadow-xs">
                      ⚡
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Assigned</p>
                      <p className="text-[11px] text-slate-400">Campus Electrical Dept</p>
                    </div>
                  </div>

                  {/* Main Product Card */}
                  <div className="perspective-card-3d bg-white rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12)] border border-slate-200/90 relative overflow-hidden">
                    
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600">
                          SMARTCAMPUS PORTAL
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                          Live Ticket Tracker
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Sync
                      </div>
                    </div>

                    {/* Interactive Category Selector */}
                    <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl my-4 text-xs font-bold text-slate-600">
                      <button
                        type="button"
                        onClick={() => setActiveDemoTab("electrical")}
                        className={`flex-1 py-1.5 rounded-lg transition-all ${
                          activeDemoTab === "electrical"
                            ? "bg-white text-blue-600 shadow-xs"
                            : "hover:text-slate-900"
                        }`}
                      >
                        💡 Lab 3 Fan
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveDemoTab("water")}
                        className={`flex-1 py-1.5 rounded-lg transition-all ${
                          activeDemoTab === "water"
                            ? "bg-white text-blue-600 shadow-xs"
                            : "hover:text-slate-900"
                        }`}
                      >
                        💧 Block C Filter
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveDemoTab("wifi")}
                        className={`flex-1 py-1.5 rounded-lg transition-all ${
                          activeDemoTab === "wifi"
                            ? "bg-white text-blue-600 shadow-xs"
                            : "hover:text-slate-900"
                        }`}
                      >
                        🌐 Hostel Wi-Fi
                      </button>
                    </div>

                    {/* Active Mock Ticket Details */}
                    <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-100 space-y-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            #TKT-8941
                          </span>
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug mt-0.5">
                            {activeDemoTab === "electrical"
                              ? "Ceiling fan rattling loudly in CS Lab"
                              : activeDemoTab === "water"
                              ? "Drinking water tap dripping in Block C"
                              : "High latency on 4th floor access point"}
                          </h4>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
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

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {activeDemoTab === "electrical"
                            ? "Academic Block A, Lab 204"
                            : activeDemoTab === "water"
                            ? "Block C 2nd Floor Corridor"
                            : "Hostel 2 Wing B, 4th Floor"}
                        </span>
                      </div>

                      {/* Mini Timeline steps */}
                      <div className="pt-3 border-t border-slate-200/70 space-y-2">
                        <div className="flex items-center gap-2.5 text-[11px]">
                          <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                            ✓
                          </span>
                          <span className="font-semibold text-slate-800">Submitted</span>
                          <span className="text-slate-400 ml-auto">10:15 AM</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[11px]">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
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
                        <div className="flex items-center gap-2.5 text-[11px]">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
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

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-semibold text-blue-600">
                        <Smartphone className="w-3.5 h-3.5" /> Mobile Optimized
                      </span>
                      <span>MongoDB Atlas Synced</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =================================================================
            "WHY SMARTCAMPUS" SECTION
            Clean 3-column desktop / 1-column mobile grid with professional icons
           ================================================================= */}
        <section className="py-20 md:py-28 bg-white border-y border-slate-200/80" id="features">
          <div className="content-container">
            {/* Section Heading */}
            <div className="text-center max-w-[720px] mx-auto mb-16">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase inline-block mb-2">
                WHY SMARTCAMPUS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
                Built specifically for real campus life.
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Say goodbye to lost paper complaints, chaotic WhatsApp groups, and unanswered college emails.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Card 1 */}
              <div className="p-7 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    Fast 30-Second Reporting
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Select a category, snap a location tag, write what's broken, and tap submit right from your smartphone.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-7 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    Live Status Timelines
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Clear step-by-step progression: Submitted → Under Review → Assigned → In Progress → Resolved. No guesswork.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-7 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    Dedicated Admin Console
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Staff and facility managers filter complaints by priority and category, assign teams, and post resolution updates.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="p-7 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    Real-Time Notifications
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Students get notified the moment their complaint is assigned, updated by a technician, or officially resolved.
                  </p>
                </div>
              </div>

              {/* Card 5 */}
              <div className="p-7 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    MongoDB Atlas Cloud
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    High-availability cloud database with automated replication, schema validation, and secure authentication.
                  </p>
                </div>
              </div>

              {/* Card 6 */}
              <div className="p-7 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    100% Mobile First
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Tailored touch targets, bottom navigation, bottom sheets, and responsive typography built for all phone screen sizes.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =================================================================
            "HOW IT WORKS" SECTION
            Polished 3-step workflow with generous spacing
           ================================================================= */}
        <section className="py-20 md:py-28 bg-slate-50" id="how-it-works">
          <div className="content-container">
            {/* Section Heading */}
            <div className="text-center max-w-[640px] mx-auto mb-16">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase inline-block mb-2">
                SIMPLE 3-STEP PROCESS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                From problem to resolution.
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Transparent campus maintenance from first report to final fix.
              </p>
            </div>

            {/* 3 Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs relative flex flex-col justify-between">
                <div>
                  <span className="text-4xl font-black text-blue-100 absolute top-6 right-6 select-none">
                    01
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
                    <Send className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    Submit with Location
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Student selects problem category (Electrical, Water, Internet, etc.) and specifies exact room or campus block.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs relative flex flex-col justify-between">
                <div>
                  <span className="text-4xl font-black text-indigo-100 absolute top-6 right-6 select-none">
                    02
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center mb-6 shadow-md shadow-indigo-500/20">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    Admin Reviews & Assigns
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Facilities admin verifies the ticket, prioritizes urgency, and assigns it directly to the relevant campus team.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs relative flex flex-col justify-between">
                <div>
                  <span className="text-4xl font-black text-emerald-100 absolute top-6 right-6 select-none">
                    03
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20">
                    <CheckCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    Fixed & Confirmed
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Technician completes the repair, resolution notes are added, and the student receives an instant confirmation.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =================================================================
            BOTTOM CTA BANNER
           ================================================================= */}
        <section className="py-12 md:py-16" id="about">
          <div className="content-container">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl shadow-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="space-y-3 max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-3.5 py-1.5 rounded-full inline-block">
                  READY TO EXPERIENCE SMARTCAMPUS?
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                  Make your campus cleaner, safer & smarter today.
                </h2>
                <p className="text-sm sm:text-base text-blue-100 font-normal">
                  Sign in with your campus account or try the live demo accounts right now.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
                <Link
                  href="/register"
                  className="px-7 py-3.5 bg-white text-blue-600 font-bold text-sm sm:text-base rounded-xl hover:bg-blue-50 active:scale-95 transition-all text-center shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="px-7 py-3.5 bg-blue-700/60 hover:bg-blue-700/80 text-white font-bold text-sm sm:text-base rounded-xl active:scale-95 transition-all text-center border border-white/20"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-10 text-xs text-slate-500">
        <div className="content-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              S
            </div>
            <strong className="text-slate-800 text-sm">SmartCampus</strong>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline">Campus Facility & Complaint Management</span>
          </div>
          <p>© 2026 SmartCampus Platform. All rights reserved.</p>
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
}