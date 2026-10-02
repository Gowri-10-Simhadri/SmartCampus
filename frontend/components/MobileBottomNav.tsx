"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  User,
  ShieldAlert,
  BarChart3,
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-bottom">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {isAdmin ? (
          <>
            {/* Admin: Overview */}
            <Link
              href="/admin"
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[50px] py-1 px-2 rounded-xl transition-all duration-150 touch-manipulation active:scale-90 ${
                pathname === "/admin"
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-transform ${
                  pathname === "/admin" ? "bg-blue-50 scale-110 shadow-sm" : ""
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Overview</span>
            </Link>

            {/* Admin: Complaints Management */}
            <Link
              href="/complaints"
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[50px] py-1 px-2 rounded-xl transition-all duration-150 touch-manipulation active:scale-90 ${
                pathname === "/complaints"
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-transform ${
                  pathname === "/complaints"
                    ? "bg-blue-50 scale-110 shadow-sm"
                    : ""
                }`}
              >
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Complaints</span>
            </Link>

            {/* Admin: Profile */}
            <Link
              href="/profile"
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[50px] py-1 px-2 rounded-xl transition-all duration-150 touch-manipulation active:scale-90 ${
                pathname === "/profile"
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-transform ${
                  pathname === "/profile"
                    ? "bg-blue-50 scale-110 shadow-sm"
                    : ""
                }`}
              >
                <User className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Profile</span>
            </Link>
          </>
        ) : (
          <>
            {/* Student: Dashboard */}
            <Link
              href="/dashboard"
              className={`flex flex-col items-center justify-center min-w-[60px] min-h-[50px] py-1 px-2 rounded-xl transition-all duration-150 touch-manipulation active:scale-90 ${
                pathname === "/dashboard"
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-transform ${
                  pathname === "/dashboard"
                    ? "bg-blue-50 scale-110 shadow-sm"
                    : ""
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Home</span>
            </Link>

            {/* Student: Complaints */}
            <Link
              href="/complaints"
              className={`flex flex-col items-center justify-center min-w-[60px] min-h-[50px] py-1 px-2 rounded-xl transition-all duration-150 touch-manipulation active:scale-90 ${
                pathname === "/complaints"
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-transform ${
                  pathname === "/complaints"
                    ? "bg-blue-50 scale-110 shadow-sm"
                    : ""
                }`}
              >
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">History</span>
            </Link>

            {/* Student: Floating Action Button: + Report */}
            <Link
              href="/complaints/new"
              className="flex flex-col items-center justify-center min-w-[64px] -mt-5 touch-manipulation active:scale-95 group"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform border-4 border-white">
                <PlusCircle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold text-blue-600 tracking-tight mt-0.5">
                Report
              </span>
            </Link>

            {/* Student: Profile */}
            <Link
              href="/profile"
              className={`flex flex-col items-center justify-center min-w-[60px] min-h-[50px] py-1 px-2 rounded-xl transition-all duration-150 touch-manipulation active:scale-90 ${
                pathname === "/profile"
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-transform ${
                  pathname === "/profile"
                    ? "bg-blue-50 scale-110 shadow-sm"
                    : ""
                }`}
              >
                <User className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Profile</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
