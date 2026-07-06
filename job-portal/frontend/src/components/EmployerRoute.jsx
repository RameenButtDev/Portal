import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function EmployerRoute() {
  const { userInfo } = useAuth();
  if (!userInfo) return <Navigate to="/login" replace />;
  if (userInfo.role !== "employer" && userInfo.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
