"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewComplaintPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electrical");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            category,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to submit complaint.");
        setLoading(false);
        return;
      }

      setMessage("Complaint submitted successfully! 🎉");

      setTitle("");
      setDescription("");
      setCategory("Electrical");

      setTimeout(() => {
        router.push("/complaints");
      }, 1200);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server.");
    }

    setLoading(false);
  }

  return (
    <main className="new-complaint-page">
      <div className="new-complaint-container">

        <div className="new-complaint-header">
          <div>
            <div className="section-tag">SMARTCAMPUS</div>
            <h1>Submit a Complaint</h1>
            <p>
              Tell us about a problem on campus and we'll help get it
              resolved.
            </p>
          </div>

          <button
            className="back-button"
            onClick={() => router.push("/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        <div className="complaint-form-card">

          <div className="form-intro">
            <div className="form-icon">📝</div>

            <div>
              <h2>Report a campus issue</h2>
              <p>
                Please provide the details below so the administrator can
                review your complaint.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="title">
                Complaint Title
              </label>

              <input
                id="title"
                type="text"
                placeholder="Example: Broken classroom fan"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="Electrical">Electrical</option>
                <option value="Water">Water</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Internet">Internet</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Classroom">Classroom</option>
                <option value="Hostel">Hostel</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                placeholder="Describe the problem in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
            </div>

            {message && (
              <div
                className={
                  message.includes("successfully")
                    ? "success-message"
                    : "error-message"
                }
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="submit-complaint-button"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Complaint →"}
            </button>

          </form>
        </div>

        <div className="form-footer">
          <span>🔒</span>
          Your complaint will be securely submitted to the campus
          administration.
        </div>

      </div>
    </main>
  );
}