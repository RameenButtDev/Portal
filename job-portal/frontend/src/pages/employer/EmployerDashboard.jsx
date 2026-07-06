import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import toast from "react-hot-toast";
import { Pencil, Trash2, Users, Eye } from "lucide-react";

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/jobs/employer/myjobs");
      setJobs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job posting?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      load();
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const toggleActive = async (job) => {
    try {
      await api.put(`/jobs/${job._id}`, { isActive: !job.isActive });
      toast.success(job.isActive ? "Job closed" : "Job reopened");
      load();
    } catch {
      toast.error("Failed to update job");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-card p-5">
          <p className="text-2xl font-bold">{jobs.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Jobs Posted</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-5">
          <p className="text-2xl font-bold">{jobs.filter((j) => j.isActive).length}</p>
          <p className="text-xs text-gray-500 mt-1">Active Jobs</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-5">
          <p className="text-2xl font-bold">{jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0)}</p>
          <p className="text-xs text-gray-500 mt-1">Total Applicants</p>
        </div>
      </div>

      <h2 className="font-display font-700 text-xl mb-4">My Job Postings</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet. <Link to="/employer/post-job" className="text-primary-700 underline">Post your first job</Link></p>
      ) : (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Applicants</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{job.title}</td>
                  <td className="px-4 py-3 text-gray-500">{job.jobType}</td>
                  <td className="px-4 py-3">
                    <Link to={`/employer/jobs/${job._id}/applicants`} className="flex items-center gap-1 text-primary-700 hover:underline">
                      <Users size={13} /> {job.applicantCount || 0}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500"><span className="flex items-center gap-1"><Eye size={13} /> {job.views}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(job)} className={`text-xs px-2 py-1 rounded-full ${job.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {job.isActive ? "Active" : "Closed"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link to={`/employer/jobs/${job._id}/edit`} className="inline-block text-blue-600 hover:text-blue-800"><Pencil size={15} /></Link>
                    <button onClick={() => deleteJob(job._id)} className="text-red-600 hover:text-red-800"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
