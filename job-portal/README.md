# CareerHub — Full-Stack MERN Job Portal

A complete job portal platform built with **MongoDB, Express, React, Node.js** — with job seeker profiles, employer job postings, resume-based applications, and a full **Admin Panel**.

---

## 📁 Project Structure
```
job-portal/
  backend/     → Node.js + Express API + MongoDB (Mongoose)
  frontend/    → React (Vite) + Tailwind CSS
```

---

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas — see previous e-commerce project README for Atlas setup steps, same process applies here)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Fill in `.env`:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string

Load sample data:
```bash
npm run seed
```
Demo accounts created:
- **Admin:** admin@jobportal.com / admin123
- **Job Seeker:** jobseeker@jobportal.com / jobseeker123
- **Employer:** employer@jobportal.com / employer123
- **Employer 2:** employer2@jobportal.com / employer123

Start backend:
```bash
npm run dev
```
Runs on **http://localhost:5000**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Runs on **http://localhost:5173**

---

## ✨ Features

**Job Seekers:**
- Browse/search jobs (keyword, location, category, job type, experience level)
- Job detail page, apply with resume upload (PDF/DOC) + cover letter
- Profile: skills, bio, experience, resume
- My Applications (status tracking: Applied → Shortlisted → Interview → Hired/Rejected)
- Save/bookmark jobs

**Employers:**
- Company profile with logo upload
- Post/edit/delete job listings
- View & manage applicants per job, update application status
- Dashboard with job stats (views, applicant counts)

**Admin Panel** (`/admin`):
- Dashboard: active jobs, applications, job seekers, employers counts
- Manage all jobs (approve/reject, activate/deactivate)
- Manage users (enable/disable, delete)
- Analytics: application trend chart, jobs-by-category pie chart, top employers

---

## 🔒 Security
- Passwords hashed with bcrypt, JWT authentication
- Role-based route protection (jobseeker / employer / admin)
- File upload restricted to PDF/DOC (resumes) and images (logos), 5MB limit
- Duplicate application prevention (unique index on job+applicant)

## 🛠 Tech Stack
React 18, React Router, Tailwind CSS, Recharts, Axios · Node.js, Express, MongoDB/Mongoose, JWT, Multer, bcryptjs
