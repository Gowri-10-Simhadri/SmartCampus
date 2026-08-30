import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="brand">
            <div className="brand-logo">S</div>
            <div>
              <div className="brand-name">SmartCampus</div>
              <div className="brand-subtitle">Campus Management</div>
            </div>
          </Link>

          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>

          <Link href="/login" className="login-button">
            Login
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-background"></div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot"></span>
              SMART CAMPUS PLATFORM
            </div>

            <h1>
              Your campus.
              <br />
              <span>Better</span>
              <br />
              <strong>connected.</strong>
            </h1>

            <p className="hero-description">
              Report campus problems, track complaints and help create a
              smarter, faster and more connected campus experience.
            </p>

            <div className="hero-buttons">
              <Link href="/login" className="primary-button">
                Get Started
                <span>→</span>
              </Link>

              <a href="#how-it-works" className="secondary-button">
                See How It Works
              </a>
            </div>

            <div className="community">
              <div className="avatar-group">
                <span>G</span>
                <span>S</span>
                <span>A</span>
              </div>

              <div>
                <strong>Built for campus communities</strong>
                <p>Students • Faculty • Administrators</p>
              </div>
            </div>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="dashboard-wrapper">
            <div className="dashboard-card">
              <div className="dashboard-header">
                <div>
                  <small>STUDENT DASHBOARD</small>
                  <h3>Good morning, Student 👋</h3>
                </div>

                <div className="profile-circle">S</div>
              </div>

              <div className="stats">
                <div className="stat-card">
                  <div className="stat-icon blue-icon">📝</div>
                  <div>
                    <span>Submitted</span>
                    <strong>08</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon orange-icon">⌛</div>
                  <div>
                    <span>In Progress</span>
                    <strong>03</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon green-icon">✓</div>
                  <div>
                    <span>Resolved</span>
                    <strong>05</strong>
                  </div>
                </div>
              </div>

              <div className="activity-card">
                <div className="activity-heading">
                  <div>
                    <small>RECENT ACTIVITY</small>
                    <h3>My Complaints</h3>
                  </div>

                  <a href="#">View all →</a>
                </div>

                <Complaint
                  icon="💡"
                  title="Classroom lighting issue"
                  category="Electrical • Room 204"
                  status="In Progress"
                  statusClass="progress"
                />

                <Complaint
                  icon="🚰"
                  title="Water dispenser problem"
                  category="Water • Block A"
                  status="Pending"
                  statusClass="pending"
                />

                <Complaint
                  icon="🧹"
                  title="Library cleaning request"
                  category="Cleanliness • Library"
                  status="Resolved"
                  statusClass="resolved"
                />
              </div>
            </div>

            <div className="floating-card floating-one">
              <span>✓</span>
              <div>
                <strong>Issue Resolved</strong>
                <small>Just now</small>
              </div>
            </div>

            <div className="floating-card floating-two">
              <span>⚡</span>
              <div>
                <strong>Fast Response</strong>
                <small>Campus support</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="section-heading">
          <div className="eyebrow">POWERFUL FEATURES</div>
          <h2>Everything your campus needs.</h2>
          <p>
            A simple platform that connects students and administrators to
            solve campus problems faster.
          </p>
        </div>

        <div className="feature-grid">
          <Feature
            icon="📝"
            title="Submit Complaints"
            description="Students can quickly report electrical, water, cleanliness, infrastructure and other campus issues."
          />

          <Feature
            icon="📊"
            title="Track Progress"
            description="Keep track of submitted complaints and see whether they are pending, in progress or resolved."
          />

          <Feature
            icon="⚡"
            title="Admin Management"
            description="Administrators can review complaints, update their status and manage campus issues efficiently."
          />

          <Feature
            icon="🔐"
            title="Secure Authentication"
            description="Student and administrator accounts are protected with secure login and authentication."
          />

          <Feature
            icon="☁️"
            title="Cloud Connected"
            description="Complaint information is securely stored and accessible through the connected campus system."
          />

          <Feature
            icon="📱"
            title="Easy to Use"
            description="A clean and intuitive interface designed for students, faculty and campus administrators."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <div className="eyebrow">HOW IT WORKS</div>
          <h2>From problem to solution.</h2>
          <p>Three simple steps to make your campus better.</p>
        </div>

        <div className="steps">
          <Step
            number="01"
            title="Report an issue"
            description="Students submit a complaint with the problem details and category."
          />

          <Step
            number="02"
            title="Admin reviews"
            description="Campus administrators review the complaint and begin working on it."
          />

          <Step
            number="03"
            title="Track & resolve"
            description="Students can follow the progress until the issue is successfully resolved."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="about">
        <div className="cta-content">
          <div>
            <div className="eyebrow">MAKE YOUR CAMPUS BETTER</div>
            <h2>Every problem deserves a solution.</h2>
            <p>
              SmartCampus makes it easier for students and administrators to
              work together.
            </p>
          </div>

          <Link href="/login" className="cta-button">
            Get Started →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="brand-logo">S</div>
            <div>
              <strong>SmartCampus</strong>
              <span>Campus Management</span>
            </div>
          </div>

          <p>© 2026 SmartCampus. Making campuses better, together.</p>
        </div>
      </footer>
    </main>
  );
}

function Complaint({
  icon,
  title,
  category,
  status,
  statusClass,
}: {
  icon: string;
  title: string;
  category: string;
  status: string;
  statusClass: string;
}) {
  return (
    <div className="complaint">
      <div className="complaint-icon">{icon}</div>

      <div className="complaint-info">
        <strong>{title}</strong>
        <span>{category}</span>
      </div>

      <span className={`complaint-status ${statusClass}`}>
        {status}
      </span>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="feature-arrow">→</span>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="step">
      <div className="step-number">{number}</div>
      <div className="step-line"></div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}