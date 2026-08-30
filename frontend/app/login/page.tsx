"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Save login information
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Redirect according to user role
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7ff",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              fontSize: "32px",
              marginBottom: "8px",
            }}
          >
            Welcome back 👋
          </h1>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Login to your SmartCampus account
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #dbe2ea",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #dbe2ea",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Back to Home */}
        <button
          onClick={() => router.push("/")}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "12px",
            border: "none",
            background: "transparent",
            color: "#2563eb",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>
      </div>
    </main>
  );
}