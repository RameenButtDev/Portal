import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import toast from "react-hot-toast";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/jobs");
      setJobs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleApproval = async (job, field) => {
    try {
      await api.put(`/admin/jobs/${job._id}`, { [field]: !job[field] });
      toast.success("Job updated");
      load();
    } catch {
      toast.error("Failed to update job");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="font-display font-700 text-xl mb-6">All Jobs</h2>
      <div className="bg-white rounded-xl shadow-card overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Employer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Approved</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="border-t">
                <td className="px-4 py-3 font-medium">{job.title}</td>
                <td className="px-4 py-3 text-gray-500">{job.employer?.companyName}<br /><span className="text-xs text-gray-400">{job.employer?.email}</span></td>
                <td className="px-4 py-3">{job.jobType}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleApproval(job, "isApproved")} className={`text-xs px-2 py-1 rounded-full ${job.isApproved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {job.isApproved ? "Approved" : "Pending"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleApproval(job, "isActive")} className={`text-xs px-2 py-1 rounded-full ${job.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {job.isActive ? "Active" : "Closed"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
