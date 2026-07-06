import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import toast from "react-hot-toast";
import { Download, Mail, Phone } from "lucide-react";

const statuses = ["Applied", "Shortlisted", "Interview", "Rejected", "Hired"];
const statusColor = {
  Applied: "bg-blue-100 text-blue-700",
  Shortlisted: "bg-purple-100 text-purple-700",
  Interview: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-700",
  Hired: "bg-green-100 text-green-700",
};

export default function Applicants() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/applications/job/${id}`);
      setApplications(data);
      const job = await api.get(`/jobs/${id}`);
      setJobTitle(job.data.title);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      toast.success("Status updated");
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-700 text-xl">Applicants</h2>
          <p className="text-sm text-gray-500">{jobTitle}</p>
        </div>
        <Link to="/employer" className="text-sm text-primary-700 hover:underline">← Back to Dashboard</Link>
      </div>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applications received yet for this job.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-xl shadow-card p-5">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold">{app.applicant?.name}</h3>
                  <p className="text-sm text-gray-500">{app.applicant?.headline}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Mail size={12} /> {app.applicant?.email}</span>
                    {app.applicant?.phone && <span className="flex items-center gap-1"><Phone size={12} /> {app.applicant.phone}</span>}
                  </div>
                  {app.applicant?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {app.applicant.skills.map((s, idx) => (
                        <span key={idx} className="text-[11px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                  {app.coverLetter && <p className="text-sm text-gray-600 mt-3 italic">"{app.coverLetter}"</p>}
                </div>
                <div className="text-right space-y-2 flex-shrink-0">
                  <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-primary-700 hover:underline justify-end">
                    <Download size={12} /> View Resume
                  </a>
                  <select value={app.status} onChange={(e) => updateStatus(app._id, e.target.value)} className={`text-xs px-2 py-1 rounded-full border-0 ${statusColor[app.status]}`}>
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
