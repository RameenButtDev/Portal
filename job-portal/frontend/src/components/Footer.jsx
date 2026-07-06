import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Facebook, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display font-700 text-xl text-white mb-3 flex items-center gap-1.5">
            <Briefcase size={20} /> Career<span className="text-accent-500">Hub</span>
          </h3>
          <p className="text-sm text-gray-400">Connecting talented job seekers with great companies across Pakistan.</p>
          <div className="flex gap-3 mt-4">
            <Facebook size={18} className="hover:text-accent-500 cursor-pointer" />
            <Linkedin size={18} className="hover:text-accent-500 cursor-pointer" />
            <Twitter size={18} className="hover:text-accent-500 cursor-pointer" />
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">For Job Seekers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/jobs" className="hover:text-accent-500">Browse Jobs</Link></li>
            <li><Link to="/register" className="hover:text-accent-500">Create Account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">For Employers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/register" className="hover:text-accent-500">Post a Job</Link></li>
            <li><Link to="/login" className="hover:text-accent-500">Employer Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
          <p className="text-sm text-gray-400">Free job posting platform helping businesses find great talent.</p>
        </div>
      </div>
      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} CareerHub. All rights reserved.
      </div>
    </footer>
  );
}
