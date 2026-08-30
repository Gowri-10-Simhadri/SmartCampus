# SmartCampus — AI-Powered College Complaint Management System

## 1. Project Overview

SmartCampus is a web-based college complaint management system that allows students to submit and track campus complaints while allowing administrators to review, assign, manage, and resolve complaints.

The application will include AI-assisted features to automatically categorize complaints, generate concise summaries, and identify potentially duplicate complaints.

The goal is to create a practical, easy-to-use and deployable college complaint platform with a working frontend, backend, database, authentication, and AI functionality.

---

## 2. Problem Statement

Students often have difficulty reporting campus problems and tracking whether those problems are being addressed.

Administrators also need an organized way to manage complaints, assign them to appropriate departments or staff, prioritize urgent issues, and monitor resolution progress.

SmartCampus provides a centralized platform for managing this complete complaint lifecycle.

---

## 3. User Roles

### Student

Students can:

- Register an account
- Log in and log out
- Submit complaints
- Add complaint title
- Add description
- Select or receive a category
- Add location
- Set/view priority
- Attach an image or file
- View submitted complaints
- Track complaint status
- View complaint details
- View complaint history
- View resolution details

### Admin

Administrators can:

- Log in
- View dashboard statistics
- View all complaints
- Search complaints
- Filter complaints
- View complaint details
- Assign complaints to departments
- Assign complaints to staff
- Change complaint status
- Change complaint priority
- Add comments
- Add resolution details
- Manage departments
- Manage staff

---

## 4. Complaint Lifecycle

A complaint follows this workflow:

Student submits complaint
        ↓
AI analyzes complaint
        ↓
Admin reviews complaint
        ↓
Department/staff assigned
        ↓
In Progress
        ↓
Resolved
        ↓
Closed
        ↓
Student views resolution

---

## 5. AI Features

### 5.1 AI Complaint Categorization

The AI should analyze the complaint title and description and suggest an appropriate category.

Possible categories include:

- Infrastructure
- Electrical
- Plumbing
- Wi-Fi / Internet
- Classroom
- Hostel
- Transportation
- Library
- Security
- Cleanliness
- Other

The administrator should be able to review or modify the AI suggestion.

### 5.2 AI Complaint Summary

The AI should generate a short summary of a complaint for administrators.

The summary should identify:

- Main issue
- Location
- Impact
- Suggested priority

### 5.3 Duplicate Complaint Detection

When a new complaint is submitted, the system should compare it with existing complaints and warn the user/admin if a similar complaint already exists.

The system should show the potentially related complaint rather than automatically rejecting the new complaint.

### 5.4 Optional AI Escalation

If time permits, the system may automatically flag complaints that remain unresolved for too long.

---

## 6. Student Dashboard

The student dashboard should show:

- Total complaints
- Pending complaints
- In-progress complaints
- Resolved complaints
- Recent complaints

The student should have access to:

- Submit Complaint
- My Complaints
- Complaint Details
- Profile

---

## 7. Admin Dashboard

The admin dashboard should show:

- Total complaints
- Pending complaints
- In-progress complaints
- Resolved complaints
- High-priority complaints
- Recent complaints

Admin should be able to search and filter complaints by:

- Status
- Category
- Priority
- Department
- Date

---

## 8. Complaint Submission

The complaint form should contain:

- Title
- Description
- Category
- Location
- Priority
- Image/file attachment

After submission:

1. Validate the complaint.
2. Store it in the database.
3. Run AI categorization.
4. Generate an AI summary.
5. Check for duplicate complaints.
6. Create the complaint with an initial status of Pending.
7. Show the complaint confirmation to the student.

---

## 9. Complaint Details

The complaint details page should display:

- Complaint title
- Description
- Category
- Location
- Priority
- Submitted date
- Current status
- Assigned department
- Assigned staff
- AI summary
- Duplicate warning if applicable
- Admin comments
- Resolution details
- Complaint status history

---

## 10. Authentication

Implement secure authentication using:

- Student registration
- Student login
- Admin login
- Password hashing
- JWT-based authentication
- Protected routes
- Logout

Users must only access functionality appropriate to their role.

---

## 11. Technology Stack

### Frontend

- Next.js
- React
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT
- Password hashing

### AI

Use a suitable AI API such as Gemini or OpenRouter.

The AI integration should use environment variables for API keys.

### Deployment

- GitHub for source code
- Vercel for frontend
- Render for backend
- MongoDB Atlas for production database

---

## 12. Database Models

### User

Fields:

- name
- email
- password
- role
- department
- createdAt

Roles:

- student
- admin
- staff

### Complaint

Fields:

- title
- description
- category
- location
- priority
- status
- imageUrl
- studentId
- assignedDepartment
- assignedStaff
- aiSummary
- aiCategory
- duplicateComplaintIds
- adminComments
- resolution
- createdAt
- updatedAt

### Department

Fields:

- name
- description
- createdAt

### ComplaintHistory

Fields:

- complaintId
- status
- comment
- changedBy
- createdAt

---

## 13. Complaint Statuses

The system should support:

- Pending
- In Progress
- Resolved
- Closed

---

## 14. Backend API

Implement REST APIs for:

### Authentication

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

### Complaints

POST /api/complaints

GET /api/complaints

GET /api/complaints/:id

PUT /api/complaints/:id

DELETE /api/complaints/:id

PUT /api/complaints/:id/status

PUT /api/complaints/:id/assign

POST /api/complaints/:id/comments

POST /api/complaints/:id/resolve

### AI

POST /api/ai/categorize

POST /api/ai/summarize

POST /api/ai/duplicate-check

### Departments

GET /api/departments

POST /api/departments

PUT /api/departments/:id

DELETE /api/departments/:id

---

## 15. Frontend Pages

### Public

- Login
- Register

### Student

- Student Dashboard
- Submit Complaint
- My Complaints
- Complaint Details
- Profile

### Admin

- Admin Dashboard
- All Complaints
- Complaint Details
- Departments
- Staff
- Settings

---

## 16. UI Requirements

The application should have:

- Clean modern interface
- Responsive design
- Sidebar navigation
- Dashboard cards
- Tables
- Status badges
- Priority badges
- Search
- Filters
- Loading states
- Empty states
- Error messages
- Success messages
- Confirmation dialogs

The interface should be easy for both students and administrators to understand.

---

## 17. Security Requirements

- Passwords must never be stored as plain text.
- JWT secrets must be stored in environment variables.
- AI API keys must be stored in environment variables.
- MongoDB credentials must be stored in environment variables.
- Do not commit .env files to GitHub.
- Validate API input.
- Protect admin-only APIs.
- Protect student data.
- Implement CORS correctly for production.
- Never expose private backend credentials in frontend code.

---

## 18. Environment Variables

Backend:

MONGODB_URI=

JWT_SECRET=

AI_API_KEY=

FRONTEND_URL=

PORT=

Frontend:

NEXT_PUBLIC_API_URL=

No secret API keys should be placed in frontend environment variables.

---

## 19. Project Structure

smartcampus/

├── frontend/

│   ├── app/

│   ├── components/

│   ├── lib/

│   ├── hooks/

│   └── public/

│

├── backend/

│   ├── controllers/

│   ├── models/

│   ├── routes/

│   ├── middleware/

│   ├── services/

│   ├── utils/

│   └── server.js

│

├── spec.md

├── README.md

└── .gitignore

---

## 20. Development Phases

### Phase 1 — Project Setup

- Create frontend
- Create backend
- Configure Tailwind
- Configure MongoDB
- Configure environment variables
- Configure authentication
- Create base layouts

### Phase 2 — Authentication

- Registration
- Login
- JWT
- Protected routes
- Role-based access

### Phase 3 — Complaint Management

- Complaint creation
- Complaint listing
- Complaint details
- Complaint updates
- Status management
- Priority management
- Department assignment
- Staff assignment
- Comments
- Resolution

### Phase 4 — Dashboards

- Student dashboard
- Admin dashboard
- Statistics
- Search
- Filters
- Status tracking

### Phase 5 — AI Features

- AI categorization
- AI summaries
- Duplicate detection
- Optional escalation

### Phase 6 — Testing and Deployment

- Test frontend
- Test backend
- Test database
- Test authentication
- Test AI
- Push to GitHub
- Deploy backend to Render
- Deploy frontend to Vercel
- Connect MongoDB Atlas
- Test production application

---

## 21. Final Expected Result

The final SmartCampus application should allow a student to:

1. Register/login.
2. Submit a complaint.
3. Receive AI-assisted categorization and summary.
4. See duplicate complaint warnings when applicable.
5. Track the complaint.
6. View status updates.
7. View the final resolution.

The administrator should be able to:

1. Login.
2. View dashboard statistics.
3. View and filter complaints.
4. Review complaints.
5. Assign departments/staff.
6. Change status and priority.
7. Add comments.
8. Resolve complaints.
9. Monitor complaint activity.

The application must be functional, connected to a database, secure, tested, and deployable.

---

## 22. Development Principle

Build the application phase-by-phase.

Do not attempt to generate the entire application in one step.

Before each phase:

1. Review the specification.
2. Understand the architecture.
3. Implement the phase.
4. Run the application.
5. Test the phase.
6. Fix errors.
7. Continue to the next phase.