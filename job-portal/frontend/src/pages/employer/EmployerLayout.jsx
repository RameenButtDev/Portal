import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, PlusCircle, LogOut, Briefcase, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function EmployerLayout() {
  const location = useLocation();
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: "/employer", label: "My Jobs", icon: LayoutDashboard, exact: true },
    { to: "/employer/post-job", label: "Post a Job", icon: PlusCircle },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-ink text-gray-300 flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <h1 className="font-display font-700 text-lg text-white flex items-center gap-1.5"><Briefcase size={18} /> Employer</h1>
          <p className="text-xs text-gray-400 mt-1">{userInfo?.companyName}</p>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-5 py-2.5 text-sm ${active ? "bg-primary-700 text-white" : "hover:bg-gray-800"}`}>
                <item.icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700 space-y-2">
          <Link to="/profile" className="flex items-center gap-2 text-xs hover:text-white"><User size={14} /> Company Profile</Link>
          <Link to="/" className="flex items-center gap-2 text-xs hover:text-white"><Briefcase size={14} /> View Site</Link>
          <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-card px-6 py-4">
          <h2 className="font-display font-600 text-lg">Welcome, {userInfo?.name}</h2>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
