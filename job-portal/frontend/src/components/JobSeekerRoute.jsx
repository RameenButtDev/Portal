import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function JobSeekerRoute() {
  const { userInfo } = useAuth();
  if (!userInfo) return <Navigate to="/login" replace />;
  if (userInfo.role !== "jobseeker") return <Navigate to="/" replace />;
  return <Outlet />;
}
