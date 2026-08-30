"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Complaint = {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: "Pending" | "In Progress" | "Resolved";
  createdAt: string;
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your complaints.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/complaints/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load complaints");
      }

      setComplaints(data.complaints || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status: string) => {
    if (status === "Resolved") return "status resolved";
    if (status === "In Progress") return "status progress";
    return "status pending";
  };

  const getStatusIcon = (status: string) => {
    if (status === "Resolved") return "✓";
    if (status === "In Progress") return "↻";
    return "⏳";
  };

  return (
    <main className="complaints-page">
      <div className="complaints-container">

        {/* Header */}
        <header className="complaints-header">
          <div>
            <div className="brand-small">SMARTCAMPUS</div>
            <h1>My Complaints</h1>
            <p>
              Track your campus complaints and stay updated on their progress.
            </p>
          </div>

          <Link href="/dashboard" className="back-button">
            ← Dashboard
          </Link>
        </header>

        {/* Summary */}
        <section className="summary-grid">
          <div className="summary-card">
            <span className="summary-icon">📋</span>
            <div>
              <strong>{complaints.length}</strong>
              <p>Total Complaints</p>
            </div>
          </div>

          <div className="summary-card">
            <span className="summary-icon">⏳</span>
            <div>
              <strong>
                {complaints.filter((c) => c.status === "Pending").length}
              </strong>
              <p>Pending</p>
            </div>
          </div>

          <div className="summary-card">
            <span className="summary-icon">🔧</span>
            <div>
              <strong>
                {complaints.filter((c) => c.status === "In Progress").length}
              </strong>
              <p>In Progress</p>
            </div>
          </div>

          <div className="summary-card">
            <span className="summary-icon">✅</span>
            <div>
              <strong>
                {complaints.filter((c) => c.status === "Resolved").length}
              </strong>
              <p>Resolved</p>
            </div>
          </div>
        </section>

        {/* Complaints */}
        <section className="complaints-section">

          <div className="section-title">
            <div>
              <h2>Complaint History</h2>
              <p>All complaints submitted by you</p>
            </div>

            <Link href="/complaints/new" className="new-complaint-button">
              + New Complaint
            </Link>
          </div>

          {loading && (
            <div className="empty-state">
              <div className="loader"></div>
              <h3>Loading complaints...</h3>
              <p>Please wait while we fetch your complaints.</p>
            </div>
          )}

          {!loading && error && (
            <div className="error-box">
              <span>⚠️</span>
              <div>
                <strong>Unable to load complaints</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && complaints.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No complaints yet</h3>
              <p>
                You haven't submitted any campus complaints yet.
              </p>

              <Link href="/complaints/new" className="new-complaint-button">
                Submit Your First Complaint →
              </Link>
            </div>
          )}

          {!loading && !error && complaints.length > 0 && (
            <div className="complaints-list">
              {complaints.map((complaint) => (
                <article className="complaint-card" key={complaint._id}>

                  <div className="complaint-main">

                    <div className="complaint-icon">
                      {complaint.category === "Electrical"
                        ? "💡"
                        : complaint.category === "Water"
                        ? "💧"
                        : complaint.category === "Internet"
                        ? "🌐"
                        : complaint.category === "Cleanliness"
                        ? "🧹"
                        : "📋"}
                    </div>

                    <div className="complaint-content">
                      <div className="complaint-top">
                        <h3>{complaint.title}</h3>

                        <span className={getStatusClass(complaint.status)}>
                          <span>
                            {getStatusIcon(complaint.status)}
                          </span>
                          {complaint.status}
                        </span>
                      </div>

                      <p className="complaint-description">
                        {complaint.description}
                      </p>

                      <div className="complaint-meta">
                        <span>🏷️ {complaint.category}</span>

                        <span>
                          📅{" "}
                          {new Date(
                            complaint.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>

                        <span className="complaint-id">
                          ID: {complaint._id.slice(-8)}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Progress */}
                  <div className="progress-area">

                    <div className="progress-line">
                      <div
                        className={`progress-step ${
                          complaint.status !== "Pending"
                            ? "completed"
                            : "active"
                        }`}
                      >
                        <span>1</span>
                        <small>Submitted</small>
                      </div>

                      <div
                        className={`progress-bar ${
                          complaint.status === "In Progress" ||
                          complaint.status === "Resolved"
                            ? "filled"
                            : ""
                        }`}
                      />

                      <div
                        className={`progress-step ${
                          complaint.status === "In Progress"
                            ? "active"
                            : complaint.status === "Resolved"
                            ? "completed"
                            : ""
                        }`}
                      >
                        <span>2</span>
                        <small>In Progress</small>
                      </div>

                      <div
                        className={`progress-bar ${
                          complaint.status === "Resolved"
                            ? "filled"
                            : ""
                        }`}
                      />

                      <div
                        className={`progress-step ${
                          complaint.status === "Resolved"
                            ? "completed"
                            : ""
                        }`}
                      >
                        <span>3</span>
                        <small>Resolved</small>
                      </div>
                    </div>

                  </div>

                </article>
              ))}
            </div>
          )}

        </section>

      </div>

      <style jsx>{`
        .complaints-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 40px 20px 80px;
        }

        .complaints-container {
          max-width: 1100px;
          margin: auto;
        }

        .complaints-header {
          background: white;
          border-radius: 24px;
          padding: 30px 34px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 10px 30px rgba(20, 30, 60, 0.06);
          margin-bottom: 24px;
        }

        .brand-small {
          color: #2563eb;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 2px;
          margin-bottom: 5px;
        }

        .complaints-header h1 {
          margin: 0;
          font-size: 32px;
          color: #111827;
        }

        .complaints-header p {
          margin: 7px 0 0;
          color: #64748b;
        }

        .back-button {
          text-decoration: none;
          color: #2563eb;
          background: #eff6ff;
          padding: 12px 18px;
          border-radius: 12px;
          font-weight: 700;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .summary-card {
          background: white;
          border-radius: 18px;
          padding: 22px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 8px 25px rgba(20, 30, 60, 0.05);
        }

        .summary-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: #f1f5f9;
          font-size: 23px;
        }

        .summary-card strong {
          display: block;
          font-size: 27px;
          color: #111827;
        }

        .summary-card p {
          margin: 2px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .complaints-section {
          background: white;
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(20, 30, 60, 0.06);
        }

        .section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 22px;
        }

        .section-title h2 {
          margin: 0;
          font-size: 23px;
          color: #111827;
        }

        .section-title p {
          margin: 5px 0 0;
          color: #64748b;
        }

        .new-complaint-button {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          color: white;
          text-decoration: none;
          padding: 13px 19px;
          border-radius: 12px;
          font-weight: 700;
          display: inline-block;
          box-shadow: 0 7px 18px rgba(37, 99, 235, 0.2);
        }

        .complaints-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .complaint-card {
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 22px;
          transition: 0.2s ease;
        }

        .complaint-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(20, 30, 60, 0.07);
        }

        .complaint-main {
          display: flex;
          gap: 17px;
        }

        .complaint-icon {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          background: #f1f5f9;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .complaint-content {
          flex: 1;
        }

        .complaint-top {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          align-items: center;
        }

        .complaint-top h3 {
          margin: 0;
          font-size: 18px;
          color: #111827;
        }

        .complaint-description {
          color: #64748b;
          margin: 8px 0;
          line-height: 1.5;
        }

        .complaint-meta {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #64748b;
        }

        .complaint-id {
          color: #94a3b8;
        }

        .status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .status.pending {
          background: #fff7ed;
          color: #c2410c;
        }

        .status.progress {
          background: #eff6ff;
          color: #2563eb;
        }

        .status.resolved {
          background: #ecfdf5;
          color: #059669;
        }

        .progress-area {
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
        }

        .progress-line {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .progress-step {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 600;
        }

        .progress-step span {
          width: 27px;
          height: 27px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
        }

        .progress-step.active,
        .progress-step.completed {
          color: #2563eb;
        }

        .progress-step.active span,
        .progress-step.completed span {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .progress-step.completed {
          color: #059669;
        }

        .progress-step.completed span {
          background: #059669;
          border-color: #059669;
        }

        .progress-bar {
          height: 3px;
          flex: 1;
          background: #e2e8f0;
          margin: 0 10px;
        }

        .progress-bar.filled {
          background: #2563eb;
        }

        .empty-state {
          text-align: center;
          padding: 65px 20px;
        }

        .empty-icon {
          font-size: 50px;
          margin-bottom: 15px;
        }

        .empty-state h3 {
          margin: 0;
          font-size: 21px;
          color: #111827;
        }

        .empty-state p {
          color: #64748b;
          margin: 8px 0 25px;
        }

        .loader {
          width: 35px;
          height: 35px;
          border: 4px solid #e5e7eb;
          border-top-color: #2563eb;
          border-radius: 50%;
          margin: 0 auto 18px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-box {
          display: flex;
          gap: 15px;
          align-items: flex-start;
          background: #fff1f2;
          color: #be123c;
          padding: 18px;
          border-radius: 14px;
        }

        .error-box p {
          margin: 5px 0 0;
        }

        @media (max-width: 800px) {
          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .complaints-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .complaint-top {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 550px) {
          .summary-grid {
            grid-template-columns: 1fr;
          }

          .complaints-section {
            padding: 20px;
          }

          .section-title {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .progress-line {
            overflow-x: auto;
            min-width: 450px;
          }
        }
      `}</style>
    </main>
  );
}