import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut, Briefcase, Bookmark, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { userInfo, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-card">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="font-display font-800 text-2xl text-primary-700 flex-shrink-0 flex items-center gap-1.5">
            <Briefcase size={22} /> Career<span className="text-accent-500">Hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/jobs" className="hover:text-primary-700">Browse Jobs</Link>
            {userInfo?.role === "employer" && <Link to="/employer" className="hover:text-primary-700">Employer Dashboard</Link>}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {userInfo ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 text-ink hover:text-primary-700 text-sm font-medium">
                  {userInfo.name.split(" ")[0]}
                  <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full capitalize">{userInfo.role}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-cardHover border border-gray-100 py-2" onMouseLeave={() => setProfileOpen(false)}>
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setProfileOpen(false)}>My Profile</Link>
                    {userInfo.role === "jobseeker" && (
                      <>
                        <Link to="/my-applications" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                          <FileText size={14} /> My Applications
                        </Link>
                        <Link to="/saved-jobs" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                          <Bookmark size={14} /> Saved Jobs
                        </Link>
                      </>
                    )}
                    {userInfo.role === "employer" && (
                      <Link to="/employer" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                        <LayoutDashboard size={14} /> Employer Dashboard
                      </Link>
                    )}
                    {userInfo.role === "admin" && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                        <LayoutDashboard size={14} /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setProfileOpen(false); navigate("/"); }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-primary-700">Login</Link>
                <Link to="/register" className="text-sm font-semibold bg-primary-700 text-white px-4 py-2 rounded-full hover:bg-primary-800">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3 text-sm">
            <Link to="/jobs" className="block py-1" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
            {userInfo ? (
              <>
                <Link to="/profile" className="block py-1" onClick={() => setMenuOpen(false)}>My Profile</Link>
                {userInfo.role === "jobseeker" && (
                  <>
                    <Link to="/my-applications" className="block py-1" onClick={() => setMenuOpen(false)}>My Applications</Link>
                    <Link to="/saved-jobs" className="block py-1" onClick={() => setMenuOpen(false)}>Saved Jobs</Link>
                  </>
                )}
                {userInfo.role === "employer" && <Link to="/employer" className="block py-1" onClick={() => setMenuOpen(false)}>Employer Dashboard</Link>}
                {userInfo.role === "admin" && <Link to="/admin" className="block py-1" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
                <button onClick={() => { logout(); setMenuOpen(false); navigate("/"); }} className="block py-1 text-red-600">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-1 font-semibold text-primary-700" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block py-1 font-semibold text-primary-700" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
