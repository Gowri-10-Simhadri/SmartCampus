# 🎓 SmartCampus — Mobile-First Campus Complaint & Facility Management

SmartCampus is a modern, mobile-first campus complaint and facility management platform. It empowers students, faculty, and administrators to report, route, track, and resolve campus infrastructure and maintenance issues with real-time updates and live MongoDB Atlas integration.

---

## 🌟 Key Features

### 📱 Student Portal (Mobile-First Experience)
- **30-Second Ticket Filing:** Report issues with title, category, detailed description, exact campus location presets, priority tags, and photo attachment URLs.
- **Visual Progress Timeline:** Track complaint progression through a live vertical event timeline: `Pending` → `Under Review` → `In Progress` → `Resolved` / `Rejected`.
- **Search & Filter Bottom Sheet:** Touch-friendly mobile bottom sheet to filter tickets by status, category, and priority without cramped desktop-like toolbars.
- **Real-Time Notification Drawer:** Automated notifications for ticket receipt, technician assignments, status changes, and resolution notes.
- **Dedicated Profile Management:** View personal ticket statistics, update account settings, and securely log out.

### 🛡️ Administrative Console
- **Live MongoDB Atlas Analytics:** Real-time KPI cards displaying Total Complaints, Pending Review, In Progress, Resolved Count, and Resolution Rate percentage.
- **Category & Pipeline Distribution:** Visual breakdown of maintenance tickets across Electrical, Water, Cleanliness, Internet, Infrastructure, and Security.
- **Ticket Assignment & Workflow:** Assign complaints to specific campus teams (e.g. Electrical Dept, Plumbing Services, IT Support) with progress notes.
- **Status Transition & Resolution Logging:** Update ticket statuses and record formal resolution summaries that instantly alert students.

### 🎨 Creative 3D UI & Visual Design
- **Subtle 3D Perspective Cards:** Interactive CSS 3D transforms (`perspective(1200px)`, `transform-style: preserve-3d`) that react to touch and pointer hover.
- **Glassmorphic Depth:** Frosted glass navigation bars and modal overlays using backdrop-blur filters.
- **Touch-First Navigation:** Ergonomic bottom navigation bar with >= 48px touch targets, safe-area padding for mobile home bars, and instant active indicators.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend:** Node.js, Express 5, Mongoose 9, JWT (jsonwebtoken), bcryptjs, CORS
- **Database:** MongoDB Atlas (Cloud Database with automatic DNS SRV fallback)
- **Deployment Targets:**
  - Frontend: Vercel / Netlify / Cloudflare Pages
  - Backend: Render / Railway / Fly.io / AWS ECS

---

## 📁 Repository Structure

```
SmartCampus/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB Atlas connection with DNS SRV fallback
│   ├── middleware/
│   │   ├── adminMiddleware.js  # Role-based admin route protection
│   │   └── authMiddleware.js   # JWT authentication verification
│   ├── models/
│   │   ├── Complaint.js        # Complaint schema with timeline & location
│   │   ├── Notification.js     # User notification schema
│   │   └── User.js             # User schema with bcrypt password hashing
│   ├── routes/
│   │   ├── adminRoutes.js      # Admin analytics, assignments, status updates
│   │   ├── auth.js             # Register, login, profile endpoints
│   │   └── complaintRoutes.js  # Student complaint creation, notifications
│   ├── createAdmin.js          # Admin & demo student seeding script
│   ├── server.js               # Express server with CORS & health check
│   ├── .env.example            # Backend environment template
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── admin/page.tsx      # Admin overview & management console
│   │   ├── complaints/         # Complaints directory & new complaint form
│   │   ├── dashboard/page.tsx  # Student dashboard
│   │   ├── login/page.tsx      # Mobile-first login with demo fill
│   │   ├── profile/page.tsx    # User profile & account settings
│   │   ├── register/page.tsx   # Student registration
│   │   ├── globals.css         # Tailwind v4, 3D perspective & mobile CSS
│   │   ├── layout.tsx          # Root layout with AuthProvider & metadata
│   │   └── page.tsx            # Redesigned 3D landing page
│   ├── components/
│   │   ├── ComplaintDetailModal.tsx  # Interactive timeline & admin action modal
│   │   ├── FilterBottomSheet.tsx     # Mobile drawer for ticket filtering
│   │   ├── MobileBottomNav.tsx       # Touch-friendly bottom navigation
│   │   └── Navbar.tsx                # Responsive top navigation & notification center
│   ├── context/
│   │   └── AuthContext.tsx     # Persistent client auth state
│   ├── lib/
│   │   └── api.ts              # Centralized API client (no hardcoded URLs)
│   ├── .env.example            # Frontend environment template
│   └── package.json
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Port for Express server | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/smartcampus?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_secure_jwt_secret_key` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:3000` or production domain |

> ⚠️ **Security Notice:** Never commit `.env` containing real database passwords or JWT secrets to Git. Use `backend/.env.example` as a template.

### Frontend (`frontend/.env.local` or Deployment Platform)
| Variable | Description | Example / Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base API URL | `http://localhost:5000` (Local) / `https://your-backend.onrender.com` (Prod) |

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18.x, v20.x, or v22.x)
- npm or pnpm
- MongoDB Atlas cluster account (or local MongoDB)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file from example
cp .env.example .env
# Edit .env with your MongoDB Atlas URI and JWT secret

# Seed Admin & Demo Student accounts
node createAdmin.js

# Start backend development server
npm run dev
# Server will run on http://localhost:5000 (Health check: http://localhost:5000/api/health)
```

### 3. Frontend Setup
```bash
# Open a new terminal in frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
# Application will run on http://localhost:3000
```

---

## 👥 Default Demo Credentials

For rapid testing and evaluation, the application provides built-in demo credentials:

| Role | Email | Password | Access |
|---|---|---|---|
| **Administrator** | `admin@smartcampus.com` | `Admin@12345` | Admin Console, Full Analytics, Status & Assignment Controls |
| **Student** | `student@smartcampus.com` | `Student@12345` | Student Dashboard, Report Issue, Live Complaint Tracking |

*Tip: The login page includes one-tap demo fill buttons to instantly populate these credentials.*

---

## 🌐 Production Deployment Guide

### Backend Deployment (Render / Railway)
1. Push your repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
3. Set the Root Directory to `backend`.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Configure Environment Variables in the service settings:
   - `MONGODB_URI`: Your production MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random cryptographic string.
   - `CLIENT_URL`: Your deployed frontend URL (e.g. `https://smartcampus.vercel.app`).
   - `PORT`: Set by platform automatically (e.g. `10000` or `5000`).
7. In MongoDB Atlas **Network Access**, ensure IP `0.0.0.0/0` (Allow Access from Anywhere) is enabled so your cloud backend can connect.

### Frontend Deployment (Vercel)
1. Import the repository on [Vercel](https://vercel.com).
2. Set the Root Directory to `frontend`.
3. Framework Preset: **Next.js**.
4. Configure Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g. `https://smartcampus-backend.onrender.com`).
5. Deploy. Vercel will build and serve the optimized application bundle.

---

## 🧪 Testing Checklist

- [x] Backend connects securely to MongoDB Atlas
- [x] Health check endpoint `/api/health` reports status `healthy` and database `connected`
- [x] Student registration, login, and JWT persistence
- [x] Complaint creation with category, location presets, and priority
- [x] Real-time student notification creation upon ticket submission
- [x] Admin console authentication and role verification
- [x] Real MongoDB aggregation for admin KPI statistics and category breakdown
- [x] Admin complaint assignment and status progression (`Under Review` → `In Progress` → `Resolved`)
- [x] Verified resolution notes and timeline synchronization
- [x] Zero horizontal overflow on mobile viewports (320px, 360px, 375px, 390px, 412px, 430px)
- [x] Next.js production build (`npm run build`) completes cleanly with 0 TypeScript errors
