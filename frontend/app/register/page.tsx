"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      console.error("Registration error:", err);
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
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "8px",
          }}
        >
          Create Account 🎓
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "30px",
          }}
        >
          Register for your SmartCampus account
        </p>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div style={{ marginBottom: "20px" }}>
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

          <div style={{ marginBottom: "20px" }}>
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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

          {success && (
            <div
              style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              {success}
            </div>
          )}

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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <button
          onClick={() => router.push("/login")}
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
          Already have an account? Login
        </button>
      </div>
    </main>
  );
}