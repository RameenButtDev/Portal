import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, Clock, Bookmark } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const typeColors = {
  "Full-time": "bg-green-100 text-green-700",
  "Part-time": "bg-blue-100 text-blue-700",
  Contract: "bg-purple-100 text-purple-700",
  Internship: "bg-orange-100 text-orange-700",
  Remote: "bg-teal-100 text-teal-700",
};

export default function JobCard({ job, savedIds = [], onToggleSaved }) {
  const { userInfo } = useAuth();
  const isSaved = savedIds.includes(job._id);

  const salaryText = job.salaryMin || job.salaryMax
    ? `Rs. ${job.salaryMin?.toLocaleString() || 0} - ${job.salaryMax?.toLocaleString() || 0} / ${job.salaryPeriod === "Yearly" ? "yr" : "mo"}`
    : "Salary not disclosed";

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userInfo || userInfo.role !== "jobseeker") return toast.error("Login as a job seeker to save jobs");
    try {
      await api.post(`/applications/saved/${job._id}`);
      toast.success(isSaved ? "Removed from saved jobs" : "Job saved");
      onToggleSaved?.();
    } catch {
      toast.error("Failed to update saved jobs");
    }
  };

  return (
    <Link to={`/jobs/${job.slug || job._id}`} className="block bg-white rounded-xl shadow-card hover:shadow-cardHover transition-all p-5 border border-gray-50">
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-700 font-bold flex-shrink-0 overflow-hidden">
            {job.companyLogo ? <img src={job.companyLogo} className="w-full h-full object-cover" /> : job.companyName?.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-ink leading-snug">{job.title}</h3>
            <p className="text-sm text-gray-500">{job.companyName}</p>
          </div>
        </div>
        {userInfo?.role === "jobseeker" && (
          <button onClick={handleSave} className={`flex-shrink-0 ${isSaved ? "text-accent-500" : "text-gray-300"} hover:text-accent-500`}>
            <Bookmark size={18} className={isSaved ? "fill-accent-500" : ""} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><MapPin size={13} /> {job.location}</span>
        <span className="flex items-center gap-1"><Briefcase size={13} /> {job.experienceLevel}</span>
        <span className="flex items-center gap-1"><Clock size={13} /> {new Date(job.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[job.jobType] || "bg-gray-100 text-gray-600"}`}>
          {job.jobType}
        </span>
        <span className="text-sm font-semibold text-primary-700">{salaryText}</span>
      </div>
    </Link>
  );
}
