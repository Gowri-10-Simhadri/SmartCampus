"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import {
  Bell,
  LogOut,
  User as UserIcon,
  Shield,
  Layers,
  Sparkles,
  ChevronDown,
  X,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotificationCount();
    }
  }, [isAuthenticated, pathname]);

  const loadNotificationCount = async () => {
    try {
      const res = await api.complaints.getNotifications();
      if (res.success) {
        setUnreadCount(res.unreadCount || 0);
        setNotifications(res.notifications || []);
      }
    } catch (e) {
      // silently handle
    }
  };

  const handleOpenNotifications = async () => {
    setNotificationsOpen(true);
    setUserMenuOpen(false);
    setLoadingNotifs(true);
    try {
      const res = await api.complaints.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNotifs(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.complaints.markAllNotificationsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const isHome = pathname === "/";

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link
            href={isAuthenticated ? (isAdmin ? "/admin" : "/dashboard") : "/"}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 group-active:scale-95 transition-transform">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  SmartCampus
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] font-medium text-slate-500 tracking-wider uppercase -mt-0.5">
                {isAdmin ? "Admin Console" : "Campus Portal"}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {isAuthenticated ? (
              <>
                <Link
                  href={isAdmin ? "/admin" : "/dashboard"}
                  className={`transition-colors hover:text-blue-600 ${
                    pathname === "/dashboard" || pathname === "/admin"
                      ? "text-blue-600 font-semibold"
                      : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/complaints"
                  className={`transition-colors hover:text-blue-600 ${
                    pathname === "/complaints"
                      ? "text-blue-600 font-semibold"
                      : ""
                  }`}
                >
                  {isAdmin ? "All Complaints" : "My Complaints"}
                </Link>
                {!isAdmin && (
                  <Link
                    href="/complaints/new"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors"
                  >
                    + Report Issue
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/#features" className="hover:text-blue-600 transition-colors">
                  Features
                </Link>
                <Link href="/#how-it-works" className="hover:text-blue-600 transition-colors">
                  How it works
                </Link>
                <Link href="/#about" className="hover:text-blue-600 transition-colors">
                  About
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <button
                  type="button"
                  onClick={handleOpenNotifications}
                  className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-sm">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* User Menu Trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all touch-manipulation"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[110px] truncate">
                      {user?.name?.split(" ")[0]}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 hidden sm:inline">
                      {user?.role}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user?.email}
                        </p>
                        <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {user?.role === "admin" ? "🛡️ Administrator" : "🎓 Student"}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          Profile & Settings
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-blue-600" />
                            Admin Console
                          </Link>
                        )}
                        <Link
                          href="/complaints"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Layers className="w-4 h-4 text-slate-400" />
                          Complaint History
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notifications Drawer / Bottom Sheet */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {loadingNotifs ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-3 text-xl">
                    🔔
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    No notifications yet
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Updates on your campus complaints will appear here in real-time.
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      notif.isRead
                        ? "bg-white border-slate-100 text-slate-600"
                        : "bg-blue-50/60 border-blue-100 text-slate-900 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">
                          {notif.type === "resolution"
                            ? "✅"
                            : notif.type === "status_change"
                            ? "🔄"
                            : notif.type === "assignment"
                            ? "👤"
                            : "📝"}
                        </span>
                        <h4 className="font-semibold text-xs text-slate-900">
                          {notif.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {new Date(notif.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 pl-6">
                      {notif.message}
                    </p>

                    {notif.complaintId && (
                      <div className="mt-2 pl-6 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setNotificationsOpen(false);
                            router.push("/complaints");
                          }}
                          className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          View Complaint <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
