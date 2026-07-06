import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import EmployerRoute from "./components/EmployerRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import JobSeekerRoute from "./components/JobSeekerRoute.jsx";

import Home from "./pages/Home.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import SavedJobs from "./pages/SavedJobs.jsx";

import EmployerLayout from "./pages/employer/EmployerLayout.jsx";
import EmployerDashboard from "./pages/employer/EmployerDashboard.jsx";
import PostJob from "./pages/employer/PostJob.jsx";
import EditJob from "./pages/employer/EditJob.jsx";
import Applicants from "./pages/employer/Applicants.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminJobs from "./pages/admin/AdminJobs.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
        </Route>

        <Route element={<EmployerRoute />}>
          <Route path="/employer" element={<EmployerLayout />}>
            <Route index element={<EmployerDashboard />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="jobs/:id/edit" element={<EditJob />} />
            <Route path="jobs/:id/applicants" element={<Applicants />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                  </Route>
                  <Route element={<JobSeekerRoute />}>
                    <Route path="/my-applications" element={<MyApplications />} />
                    <Route path="/saved-jobs" element={<SavedJobs />} />
                  </Route>
                  <Route path="*" element={<div className="text-center py-20">Page not found</div>} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}
