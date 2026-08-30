"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Complaint = {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  student?: {
    _id: string;
    name: string;
    email: string;
  };
};

type User = {
  name: string;
  email: string;
  role: string;
};

const API_URL = "http://localhost:5000";

const statuses = ["Pending", "In Progress", "Resolved"];

export default function AdminPage() {
  const router = useRouter();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  // --------------------------------------------------
  // CHECK LOGIN + ADMIN ROLE
  // --------------------------------------------------

  async function checkAdminAndLoad() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        router.push("/login");
        return;
      }

      let user: User;

      try {
        user = JSON.parse(savedUser);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      // IMPORTANT:
      // Only admin users are allowed to open this page.
      if (user.role?.toLowerCase() !== "admin") {
        router.push("/dashboard");
        return;
      }

      await fetchComplaints();
    } catch (err) {
      console.error("Admin page error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load admin portal."
      );

      setLoading(false);
    }
  }

  // --------------------------------------------------
  // FETCH ALL COMPLAINTS
  // --------------------------------------------------

  async function fetchComplaints() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/complaints`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // DO NOT blindly call response.json()
      // Backend may return HTML for a 404/500.
      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();

        console.error(
          "Admin complaints API returned non-JSON:",
          text
        );

        throw new Error(
          `Admin API returned ${response.status} instead of JSON. ` +
            `Check the backend route: GET /api/admin/complaints`
        );
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load complaints."
        );
      }

      setComplaints(data.complaints || []);
    } catch (err) {
      console.error("Fetch complaints error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading complaints."
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // UPDATE COMPLAINT STATUS
  // --------------------------------------------------

  async function updateStatus(id: string, status: string) {
    if (updating) {
      return;
    }

    try {
      setUpdating(id);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      console.log("Updating complaint:", {
        id,
        status,
        url: `${API_URL}/api/admin/complaints/${id}/status`,
      });

      const response = await fetch(
        `${API_URL}/api/admin/complaints/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      // --------------------------------------------
      // SAFELY READ BACKEND RESPONSE
      // --------------------------------------------

      const contentType =
        response.headers.get("content-type") || "";

      let data: any = null;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error(
          "Status update returned non-JSON:",
          text
        );

        if (response.status === 404) {
          throw new Error(
            "Status update API route was not found. " +
              "Backend is missing: PUT /api/admin/complaints/:id/status"
          );
        }

        if (response.status === 401) {
          throw new Error(
            "You are not authorized. Please logout and login again as admin."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "Access denied. Your account does not have admin permission."
          );
        }

        if (response.status >= 500) {
          throw new Error(
            "Backend server error while updating the complaint. " +
              "Check your backend terminal."
          );
        }

        throw new Error(
          `Server returned ${response.status} instead of JSON.`
        );
      }

      // --------------------------------------------
      // HANDLE JSON ERROR
      // --------------------------------------------

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Unable to update complaint status."
        );
      }

      // --------------------------------------------
      // UPDATE UI IMMEDIATELY
      // --------------------------------------------

      setComplaints((current) =>
        current.map((complaint) =>
          complaint._id === id
            ? {
                ...complaint,
                status: status,
                updatedAt: new Date().toISOString(),
              }
            : complaint
        )
      );

      console.log(
        `Complaint ${id} successfully changed to ${status}`
      );
    } catch (err) {
      console.error("Update status error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update complaint status."
      );
    } finally {
      setUpdating(null);
    }
  }

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  }

  // --------------------------------------------------
  // STATISTICS
  // --------------------------------------------------

  const statistics = useMemo(() => {
    return {
      total: complaints.length,

      pending: complaints.filter(
        (c) => c.status === "Pending"
      ).length,

      progress: complaints.filter(
        (c) => c.status === "In Progress"
      ).length,

      resolved: complaints.filter(
        (c) => c.status === "Resolved"
      ).length,
    };
  }, [complaints]);

  // --------------------------------------------------
  // SEARCH + FILTER
  // --------------------------------------------------

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const text = search.toLowerCase().trim();

      const matchesSearch =
        complaint.title?.toLowerCase().includes(text) ||
        complaint.description?.toLowerCase().includes(text) ||
        complaint.category?.toLowerCase().includes(text) ||
        complaint.student?.name
          ?.toLowerCase()
          .includes(text) ||
        complaint.student?.email
          ?.toLowerCase()
          .includes(text);

      const matchesFilter =
        filter === "All" ||
        complaint.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [complaints, search, filter]);

  // --------------------------------------------------
  // STATUS CSS
  // --------------------------------------------------

  function statusClass(status: string) {
    if (status === "Resolved") {
      return "admin-status resolved";
    }

    if (status === "In Progress") {
      return "admin-status progress";
    }

    return "admin-status pending";
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <main className="admin-page">
      <div className="admin-container">

        {/* HEADER */}
        <header className="admin-header">
          <div>
            <div className="admin-brand">
              SMARTCAMPUS
            </div>

            <h1>Admin Control Center</h1>

            <p>
              Manage campus complaints and keep every issue
              moving toward resolution.
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              className="refresh-button"
              onClick={fetchComplaints}
              disabled={loading || updating !== null}
            >
              ↻ Refresh
            </button>

            <button
              className="logout-button"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div className="admin-error">
            ⚠️ {error}
          </div>
        )}

        {/* HERO */}
        <section className="admin-hero">
          <div>
            <span className="admin-eyebrow">
              ● ADMINISTRATOR PORTAL
            </span>

            <h2>
              Keep your campus
              <br />
              <span>running better.</span>
            </h2>

            <p>
              Review complaints, monitor progress and resolve
              student issues from one central dashboard.
            </p>
          </div>

          <div className="admin-hero-icon">
            ⚡
          </div>
        </section>

        {/* STATISTICS */}
        <section className="admin-stats">

          <div className="admin-stat-card">
            <div className="stat-top">
              <span>Total Complaints</span>
              <div className="stat-icon blue">
                📋
              </div>
            </div>

            <strong>{statistics.total}</strong>

            <small>
              All submitted complaints
            </small>
          </div>

          <div className="admin-stat-card">
            <div className="stat-top">
              <span>Pending</span>
              <div className="stat-icon orange">
                ⏳
              </div>
            </div>

            <strong>{statistics.pending}</strong>

            <small>
              Waiting for review
            </small>
          </div>

          <div className="admin-stat-card">
            <div className="stat-top">
              <span>In Progress</span>
              <div className="stat-icon purple">
                🔧
              </div>
            </div>

            <strong>{statistics.progress}</strong>

            <small>
              Currently being handled
            </small>
          </div>

          <div className="admin-stat-card">
            <div className="stat-top">
              <span>Resolved</span>
              <div className="stat-icon green">
                ✓
              </div>
            </div>

            <strong>{statistics.resolved}</strong>

            <small>
              Successfully completed
            </small>
          </div>

        </section>

        {/* MANAGEMENT */}
        <section className="admin-management">

          <div className="management-header">
            <div>
              <span className="small-label">
                COMPLAINT MANAGEMENT
              </span>

              <h2>
                All Student Complaints
              </h2>

              <p>
                Review every campus issue and update its
                current status.
              </p>
            </div>

            <div className="complaint-count">
              {filteredComplaints.length} complaints
            </div>
          </div>

          {/* SEARCH + FILTER */}
          <div className="admin-controls">

            <div className="search-box">
              🔎

              <input
                type="text"
                placeholder="Search complaints, students or categories..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="filter-select"
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Resolved">
                Resolved
              </option>
            </select>

          </div>

          {/* COMPLAINT LIST */}
          <div className="admin-list">

            {loading ? (
              <div className="admin-empty">
                <div className="loading-spinner"></div>

                <h3>
                  Loading complaints...
                </h3>

                <p>
                  Please wait while we fetch the latest
                  complaints.
                </p>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="admin-empty">
                <div className="empty-icon">
                  📭
                </div>

                <h3>
                  No complaints found
                </h3>

                <p>
                  Try changing your search or filter.
                </p>
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <article
                  className="admin-complaint-card"
                  key={complaint._id}
                >

                  <div className="complaint-main">

                    <div className="complaint-icon">
                      {complaint.category ===
                      "Electrical"
                        ? "💡"
                        : complaint.category ===
                          "Water"
                        ? "🚰"
                        : complaint.category ===
                          "Cleanliness"
                        ? "🧹"
                        : complaint.category ===
                          "Internet"
                        ? "🌐"
                        : complaint.category ===
                          "Infrastructure"
                        ? "🏗️"
                        : complaint.category ===
                          "Classroom"
                        ? "🏫"
                        : complaint.category ===
                          "Hostel"
                        ? "🛏️"
                        : complaint.category ===
                          "Transportation"
                        ? "🚌"
                        : "📋"}
                    </div>

                    <div className="complaint-content">

                      <div className="complaint-title-row">

                        <div>
                          <h3>
                            {complaint.title}
                          </h3>

                          <div className="complaint-meta">

                            <span>
                              🏷️{" "}
                              {complaint.category}
                            </span>

                            <span>
                              📅{" "}
                              {new Date(
                                complaint.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )}
                            </span>

                            <span>
                              ID:{" "}
                              {complaint._id.slice(
                                -8
                              )}
                            </span>

                          </div>
                        </div>

                        <span
                          className={statusClass(
                            complaint.status
                          )}
                        >
                          {complaint.status}
                        </span>

                      </div>

                      <p className="complaint-description">
                        {complaint.description}
                      </p>

                      {/* STUDENT */}
                      <div className="student-info">

                        <div className="student-avatar">
                          {complaint.student?.name
                            ?.charAt(0)
                            .toUpperCase() || "S"}
                        </div>

                        <div>
                          <strong>
                            {complaint.student?.name ||
                              "Unknown Student"}
                          </strong>

                          <span>
                            {complaint.student?.email ||
                              "No email available"}
                          </span>
                        </div>

                      </div>

                    </div>
                  </div>

                  {/* STATUS CONTROL */}
                  <div className="status-control">

                    <span>
                      Update status
                    </span>

                    <div className="status-buttons">

                      {statuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          className={
                            complaint.status === status
                              ? `status-button active-${status
                                  .toLowerCase()
                                  .replace(" ", "-")}`
                              : "status-button"
                          }
                          disabled={
                            updating ===
                            complaint._id
                          }
                          onClick={() =>
                            updateStatus(
                              complaint._id,
                              status
                            )
                          }
                        >
                          {status === "Pending" &&
                            "⏳ "}

                          {status === "In Progress" &&
                            "🔧 "}

                          {status === "Resolved" &&
                            "✓ "}

                          {status}
                        </button>
                      ))}

                    </div>

                  </div>

                </article>
              ))
            )}

          </div>

        </section>

        {/* FOOTER */}
        <footer className="admin-footer">

          <div>
            <strong>
              SmartCampus
            </strong>

            <span>
              Campus Complaint Management System
            </span>
          </div>

          <span>
            Admin Control Center • 2026
          </span>

        </footer>

      </div>

      {/* STYLES */}
      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 90% 5%,
              rgba(79, 70, 229, 0.1),
              transparent 25%
            ),
            #f5f7fb;
          color: #111827;
          padding: 35px 20px 60px;
        }

        .admin-container {
          max-width: 1180px;
          margin: 0 auto;
        }

        .admin-header {
          background: white;
          border: 1px solid #e8ebf2;
          border-radius: 24px;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-shadow: 0 15px 40px rgba(25, 35, 60, 0.06);
        }

        .admin-brand {
          color: #315bea;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .admin-header h1 {
          margin: 5px 0;
          font-size: 32px;
          letter-spacing: -1px;
        }

        .admin-header p {
          margin: 0;
          color: #718096;
        }

        .admin-header-actions {
          display: flex;
          gap: 10px;
        }

        .refresh-button,
        .logout-button {
          border: 0;
          border-radius: 12px;
          padding: 12px 18px;
          font-weight: 700;
          cursor: pointer;
        }

        .refresh-button {
          background: #eef3ff;
          color: #315bea;
        }

        .logout-button {
          background: #ffe8e8;
          color: #dc2626;
        }

        .refresh-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .admin-error {
          margin-top: 18px;
          background: #fff1f2;
          color: #be123c;
          border: 1px solid #fecdd3;
          border-radius: 14px;
          padding: 14px 18px;
          line-height: 1.5;
        }

        .admin-hero {
          margin-top: 24px;
          border-radius: 26px;
          padding: 38px 42px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background:
            radial-gradient(
              circle at 85% 30%,
              rgba(255,255,255,.18),
              transparent 25%
            ),
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5,
              #7c3aed
            );
          box-shadow:
            0 25px 50px rgba(67, 79, 220, 0.2);
        }

        .admin-eyebrow {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.8px;
          opacity: .9;
        }

        .admin-hero h2 {
          font-size: 42px;
          line-height: 1.05;
          letter-spacing: -2px;
          margin: 14px 0;
        }

        .admin-hero h2 span {
          color: #dbeafe;
        }

        .admin-hero p {
          max-width: 580px;
          line-height: 1.6;
          opacity: .9;
          margin: 0;
        }

        .admin-hero-icon {
          width: 100px;
          height: 100px;
          border-radius: 28px;
          background: rgba(255,255,255,.14);
          border: 1px solid rgba(255,255,255,.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 44px;
          backdrop-filter: blur(10px);
        }

        .admin-stats {
          margin-top: 22px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .admin-stat-card {
          background: white;
          border: 1px solid #e8ebf2;
          border-radius: 20px;
          padding: 22px;
          box-shadow:
            0 12px 30px rgba(25, 35, 60, .04);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          background: #f3f6fb;
        }

        .admin-stat-card strong {
          display: block;
          font-size: 34px;
          margin-top: 18px;
        }

        .admin-stat-card small {
          display: block;
          margin-top: 3px;
          color: #94a3b8;
        }

        .admin-management {
          margin-top: 24px;
          background: white;
          border: 1px solid #e8ebf2;
          border-radius: 26px;
          padding: 30px;
          box-shadow:
            0 15px 40px rgba(25, 35, 60, .05);
        }

        .management-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
        }

        .small-label {
          color: #315bea;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .management-header h2 {
          font-size: 26px;
          margin: 6px 0;
        }

        .management-header p {
          margin: 0;
          color: #718096;
        }

        .complaint-count {
          background: #f3f6fb;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
          color: #475569;
        }

        .admin-controls {
          display: flex;
          gap: 12px;
          margin: 26px 0;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #dfe5ee;
          border-radius: 13px;
          padding: 0 14px;
          background: #fbfcfe;
        }

        .search-box input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          padding: 13px 0;
          font-size: 14px;
        }

        .filter-select {
          border: 1px solid #dfe5ee;
          border-radius: 13px;
          padding: 0 14px;
          background: white;
          color: #334155;
          font-weight: 700;
          outline: 0;
        }

        .admin-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .admin-complaint-card {
          border: 1px solid #e6eaf1;
          border-radius: 20px;
          overflow: hidden;
          transition: .2s ease;
        }

        .admin-complaint-card:hover {
          border-color: #cbd5e1;
          box-shadow:
            0 15px 30px rgba(15, 23, 42, .05);
        }

        .complaint-main {
          display: flex;
          gap: 18px;
          padding: 22px;
        }

        .complaint-icon {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          border-radius: 15px;
          background: #f3f6fb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
        }

        .complaint-content {
          flex: 1;
        }

        .complaint-title-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .complaint-title-row h3 {
          margin: 0;
          font-size: 18px;
        }

        .complaint-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 7px;
          color: #94a3b8;
          font-size: 12px;
        }

        .complaint-description {
          color: #64748b;
          line-height: 1.6;
          margin: 15px 0;
        }

        .student-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .student-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background:
            linear-gradient(
              135deg,
              #315bea,
              #7c3aed
            );
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
        }

        .student-info strong,
        .student-info span {
          display: block;
        }

        .student-info strong {
          font-size: 13px;
        }

        .student-info span {
          color: #94a3b8;
          font-size: 11px;
          margin-top: 2px;
        }

        .admin-status {
          height: fit-content;
          white-space: nowrap;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 900;
        }

        .admin-status.pending {
          color: #c26b00;
          background: #fff4df;
        }

        .admin-status.progress {
          color: #2563eb;
          background: #eaf1ff;
        }

        .admin-status.resolved {
          color: #16803c;
          background: #e8f8ed;
        }

        .status-control {
          border-top: 1px solid #edf0f5;
          background: #fafbfc;
          padding: 14px 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .status-control > span {
          color: #64748b;
          font-size: 12px;
          font-weight: 800;
        }

        .status-buttons {
          display: flex;
          gap: 8px;
        }

        .status-button {
          border: 1px solid #dfe5ee;
          background: white;
          color: #64748b;
          border-radius: 10px;
          padding: 8px 11px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
        }

        .status-button:hover:not(:disabled) {
          border-color: #315bea;
          color: #315bea;
        }

        .status-button:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .status-button.active-pending {
          background: #fff4df;
          border-color: #ffd58a;
          color: #c26b00;
        }

        .status-button.active-in-progress {
          background: #eaf1ff;
          border-color: #b8cdfd;
          color: #2563eb;
        }

        .status-button.active-resolved {
          background: #e8f8ed;
          border-color: #a9e4bd;
          color: #16803c;
        }

        .admin-empty {
          padding: 70px 20px;
          text-align: center;
          color: #64748b;
        }

        .empty-icon {
          font-size: 42px;
        }

        .admin-empty h3 {
          color: #1e293b;
          margin-bottom: 5px;
        }

        .loading-spinner {
          width: 38px;
          height: 38px;
          border: 4px solid #e5e7eb;
          border-top-color: #315bea;
          border-radius: 50%;
          margin: 0 auto 15px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .admin-footer {
          padding: 28px 5px 0;
          display: flex;
          justify-content: space-between;
          color: #94a3b8;
          font-size: 12px;
        }

        .admin-footer strong,
        .admin-footer span {
          display: block;
        }

        .admin-footer strong {
          color: #334155;
          margin-bottom: 3px;
        }

        @media (max-width: 900px) {
          .admin-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .admin-hero h2 {
            font-size: 34px;
          }
        }

        @media (max-width: 650px) {
          .admin-page {
            padding: 15px 10px 40px;
          }

          .admin-header,
          .management-header,
          .admin-controls,
          .status-control,
          .admin-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .admin-header-actions {
            width: 100%;
          }

          .admin-header-actions button {
            flex: 1;
          }

          .admin-hero {
            padding: 28px;
          }

          .admin-hero-icon {
            display: none;
          }

          .admin-stats {
            grid-template-columns: 1fr;
          }

          .admin-management {
            padding: 18px;
          }

          .complaint-main {
            padding: 16px;
          }

          .complaint-title-row {
            flex-direction: column;
          }

          .status-buttons {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </main>
  );
}