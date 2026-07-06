import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const statusColor = {
  Applied: "bg-blue-100 text-blue-700",
  Shortlisted: "bg-purple-100 text-purple-700",
  Interview: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-700",
  Hired: "bg-green-100 text-green-700",
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/applications/myapplications");
      setApplications(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const withdraw = async (id) => {
    if (!window.confirm("Withdraw this application?")) return;
    try {
      await api.delete(`/applications/${id}`);
      toast.success("Application withdrawn");
      load();
    } catch {
      toast.error("Failed to withdraw");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display font-700 text-2xl mb-6">My Applications</h1>
      {applications.length === 0 ? (
        <p className="text-gray-500">You haven't applied to any jobs yet. <Link to="/jobs" className="text-primary-700 underline">Browse jobs</Link></p>
      ) : (
        <div className="space-y-4">
          {applications.map((a) => (
            <div key={a._id} className="bg-white shadow-card rounded-xl p-4 flex justify-between items-start gap-4">
              <div>
                <Link to={`/jobs/${a.job?.slug || a.job?._id}`} className="font-medium hover:text-primary-700">{a.job?.title || "Job removed"}</Link>
                <p className="text-sm text-gray-500">{a.job?.companyName} · {a.job?.location}</p>
                <p className="text-xs text-gray-400 mt-1">Applied on {new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right space-y-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${statusColor[a.status]}`}>{a.status}</span>
                {a.status === "Applied" && (
                  <button onClick={() => withdraw(a._id)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800">
                    <Trash2 size={12} /> Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
