"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  role: string;
}

interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error("Failed to read saved user:", error);
      localStorage.removeItem("user");
      router.push("/login");
      return;
    }

    fetch("http://localhost:5000/api/complaints/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComplaints(data.complaints || []);
        } else {
          console.error("Failed to load complaints:", data.message);
        }
      })
      .catch((error) => {
        console.error("Failed to load complaints:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const pending = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f8fc",
        padding: "30px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <header
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "22px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
            marginBottom: "30px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#2563eb",
                letterSpacing: "1px",
                marginBottom: "5px",
              }}
            >
              SMARTCAMPUS
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "25px",
              }}
            >
              Student Dashboard
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <strong>{user?.name}</strong>

              <div
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                {user?.email}
              </div>
            </div>

            <button
              onClick={logout}
              style={{
                border: "none",
                background: "#fee2e2",
                color: "#dc2626",
                padding: "10px 16px",
                borderRadius: "10px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Welcome Section */}
        <section
          style={{
            background: "linear-gradient(135deg, #2563eb, #4f46e5)",
            color: "white",
            borderRadius: "22px",
            padding: "35px",
            marginBottom: "25px",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              opacity: 0.85,
            }}
          >
            Welcome back 👋
          </p>

          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "32px",
            }}
          >
            {user?.name}
          </h2>

          <p
            style={{
              margin: 0,
              opacity: 0.9,
            }}
          >
            Track your campus complaints and stay updated on their progress.
          </p>
        </section>

        {/* Statistics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "18px",
            marginBottom: "25px",
          }}
        >
          <StatCard
            title="Total Complaints"
            value={complaints.length}
            icon="📋"
          />

          <StatCard
            title="Pending"
            value={pending}
            icon="⏳"
          />

          <StatCard
            title="In Progress"
            value={inProgress}
            icon="🔧"
          />

          <StatCard
            title="Resolved"
            value={resolved}
            icon="✅"
          />
        </div>

        {/* Action Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          {/* Submit Complaint */}

          <a
            href="/complaints/new"
            style={{
              display: "block",
              padding: "25px",
              borderRadius: "18px",
              background: "white",
              textAlign: "left",
              textDecoration: "none",
              color: "#0f172a",
              cursor: "pointer",
              boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                marginBottom: "10px",
              }}
            >
              📝
            </div>

            <strong
              style={{
                fontSize: "19px",
              }}
            >
              Submit a Complaint
            </strong>

            <p
              style={{
                color: "#64748b",
                marginBottom: 0,
              }}
            >
              Report a new problem on campus.
            </p>
          </a>

          {/* View All Complaints */}

          <a
            href="/complaints"
            style={{
              display: "block",
              padding: "25px",
              borderRadius: "18px",
              background: "white",
              textAlign: "left",
              textDecoration: "none",
              color: "#0f172a",
              cursor: "pointer",
              boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                marginBottom: "10px",
              }}
            >
              📊
            </div>

            <strong
              style={{
                fontSize: "19px",
              }}
            >
              View All Complaints
            </strong>

            <p
              style={{
                color: "#64748b",
                marginBottom: 0,
              }}
            >
              Track all your submitted complaints.
            </p>
          </a>
        </div>

        {/* Recent Complaints */}
        <section
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "28px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>
                Recent Complaints
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#64748b",
                }}
              >
                Your latest campus reports
              </p>
            </div>

            <a
              href="/complaints"
              style={{
                border: "none",
                background: "transparent",
                color: "#2563eb",
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              View all →
            </a>
          </div>

          {loading ? (
            <p style={{ color: "#64748b" }}>
              Loading complaints...
            </p>
          ) : complaints.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#64748b",
              }}
            >
              <div
                style={{
                  fontSize: "40px",
                }}
              >
                📭
              </div>

              <h3>No complaints yet</h3>

              <p>
                You haven't submitted any campus complaints.
              </p>
            </div>
          ) : (
            complaints.slice(0, 5).map((complaint) => (
              <div
                key={complaint._id}
                style={{
                  padding: "18px 0",
                  borderTop: "1px solid #eef2f7",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div>
                  <strong>
                    {complaint.title}
                  </strong>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      marginTop: "5px",
                    }}
                  >
                    {complaint.category}
                  </div>
                </div>

                <StatusBadge
                  status={complaint.status}
                />
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

/* Statistics Card */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "22px",
        borderRadius: "18px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          fontSize: "25px",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: 700,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        {title}
      </div>
    </div>
  );
}

/* Status Badge */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  let background = "#fef3c7";
  let color = "#92400e";

  if (status === "In Progress") {
    background = "#dbeafe";
    color = "#1d4ed8";
  }

  if (status === "Resolved") {
    background = "#dcfce7";
    color = "#166534";
  }

  return (
    <span
      style={{
        background,
        color,
        padding: "7px 12px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}