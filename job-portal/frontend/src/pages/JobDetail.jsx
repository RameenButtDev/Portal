import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { MapPin, Briefcase, Clock, Building2, Upload, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data)).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (userInfo?.role === "jobseeker") {
      api.get("/applications/myapplications").then((res) => {
        const found = res.data.find((a) => a.job?._id === job?._id);
        if (found) setAlreadyApplied(true);
      });
    }
  }, [job, userInfo]);

  const handleApplyClick = () => {
    if (!userInfo) return navigate(`/login?redirect=/jobs/${id}`);
    if (userInfo.role !== "jobseeker") return toast.error("Only job seekers can apply");
    setShowApplyForm(true);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      let resumeUrl = userInfo.resumeUrl;

      if (resumeFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append("resume", resumeFile);
        const { data } = await api.post("/upload/resume", fd, { headers: { "Content-Type": "multipart/form-data" } });
        resumeUrl = data.url;
        setUploading(false);
      }

      if (!resumeUrl) {
        toast.error("Please upload your resume");
        setApplying(false);
        return;
      }

      await api.post("/applications", { jobId: job._id, coverLetter, resumeUrl });
      toast.success("Application submitted!");
      setAlreadyApplied(true);
      setShowApplyForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loader />;
  if (!job) return <p className="text-center py-20">Job not found.</p>;

  const salaryText = job.salaryMin || job.salaryMax
    ? `Rs. ${job.salaryMin?.toLocaleString() || 0} - ${job.salaryMax?.toLocaleString() || 0} / ${job.salaryPeriod === "Yearly" ? "year" : "month"}`
    : "Salary not disclosed";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-primary-50 flex items-center justify-center text-primary-700 font-bold text-xl flex-shrink-0 overflow-hidden">
            {job.companyLogo ? <img src={job.companyLogo} className="w-full h-full object-cover" /> : job.companyName?.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="font-display font-700 text-2xl mb-1">{job.title}</h1>
            <p className="text-gray-500 flex items-center gap-1.5"><Building2 size={15} /> {job.companyName}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}{job.isRemote && " (Remote)"}</span>
              <span className="flex items-center gap-1"><Briefcase size={14} /> {job.jobType} · {job.experienceLevel}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t">
          <span className="text-lg font-bold text-primary-700">{salaryText}</span>
          {alreadyApplied ? (
            <span className="flex items-center gap-2 text-green-600 font-semibold text-sm">
              <CheckCircle2 size={18} /> Applied
            </span>
          ) : (
            <button onClick={handleApplyClick} className="bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-2.5 rounded-full transition">
              Apply Now
            </button>
          )}
        </div>
      </div>

      {showApplyForm && (
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          <h3 className="font-semibold mb-4">Apply to {job.title}</h3>
          <form onSubmit={submitApplication} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Resume (PDF/DOC)</label>
              {userInfo?.resumeUrl && !resumeFile && (
                <p className="text-xs text-gray-500 mb-2">
                  Using resume from your profile, or{" "}
                  <label className="text-primary-700 underline cursor-pointer">
                    upload a new one
                    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} className="hidden" />
                  </label>
                </p>
              )}
              {(!userInfo?.resumeUrl || resumeFile) && (
                <label className="inline-flex items-center gap-2 text-sm border rounded-full px-4 py-2 cursor-pointer hover:bg-gray-50">
                  <Upload size={14} /> {resumeFile ? resumeFile.name : "Choose Resume File"}
                  <input type="file" accept=".pdf,.doc,.docx" required={!userInfo?.resumeUrl} onChange={(e) => setResumeFile(e.target.files[0])} className="hidden" />
                </label>
              )}
            </div>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a short cover letter (optional)..."
              rows={4}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <div className="flex gap-3">
              <button disabled={applying || uploading} className="bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-full text-sm disabled:opacity-60">
                {uploading ? "Uploading..." : applying ? "Submitting..." : "Submit Application"}
              </button>
              <button type="button" onClick={() => setShowApplyForm(false)} className="text-sm text-gray-500">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-card p-6 space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Job Description</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">{job.description}</p>
        </div>
        {job.responsibilities && (
          <div>
            <h3 className="font-semibold mb-2">Responsibilities</h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">{job.responsibilities}</p>
          </div>
        )}
        {job.requirements && (
          <div>
            <h3 className="font-semibold mb-2">Requirements</h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">{job.requirements}</p>
          </div>
        )}
        {job.skills?.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s, idx) => (
                <span key={idx} className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
