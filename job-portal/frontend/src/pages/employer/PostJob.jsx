import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import toast from "react-hot-toast";

const categories = ["Software & IT", "Marketing", "Sales", "Design", "Finance & Accounting", "Customer Support", "Human Resources", "Operations", "Other"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Manager"];

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", responsibilities: "", requirements: "", location: "",
    isRemote: false, jobType: "Full-time", category: "Software & IT", experienceLevel: "Entry Level",
    skills: "", salaryMin: "", salaryMax: "", salaryPeriod: "Monthly", applicationDeadline: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        salaryMin: Number(form.salaryMin) || 0,
        salaryMax: Number(form.salaryMax) || 0,
      };
      await api.post("/jobs", payload);
      toast.success("Job posted successfully!");
      navigate("/employer");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="font-display font-700 text-xl mb-6">Post a New Job</h2>
      <form onSubmit={submit} className="bg-white rounded-xl shadow-card p-6 space-y-4">
        <input name="title" value={form.title} onChange={handleChange} required placeholder="Job Title" className="w-full border rounded px-3 py-2 text-sm" />
        <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Job Description" rows={4} className="w-full border rounded px-3 py-2 text-sm" />
        <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange} placeholder="Responsibilities" rows={3} className="w-full border rounded px-3 py-2 text-sm" />
        <textarea name="requirements" value={form.requirements} onChange={handleChange} placeholder="Requirements" rows={3} className="w-full border rounded px-3 py-2 text-sm" />

        <div className="grid grid-cols-2 gap-4">
          <input name="location" value={form.location} onChange={handleChange} required placeholder="Location (e.g. Lahore)" className="border rounded px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isRemote" checked={form.isRemote} onChange={handleChange} /> Remote job
          </label>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <select name="jobType" value={form.jobType} onChange={handleChange} className="border rounded px-3 py-2 text-sm">
            {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select name="category" value={form.category} onChange={handleChange} className="border rounded px-3 py-2 text-sm">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className="border rounded px-3 py-2 text-sm">
            {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated: React, Node.js)" className="w-full border rounded px-3 py-2 text-sm" />

        <div className="grid grid-cols-3 gap-4">
          <input name="salaryMin" type="number" value={form.salaryMin} onChange={handleChange} placeholder="Min Salary" className="border rounded px-3 py-2 text-sm" />
          <input name="salaryMax" type="number" value={form.salaryMax} onChange={handleChange} placeholder="Max Salary" className="border rounded px-3 py-2 text-sm" />
          <select name="salaryPeriod" value={form.salaryPeriod} onChange={handleChange} className="border rounded px-3 py-2 text-sm">
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Application Deadline (optional)</label>
          <input name="applicationDeadline" type="date" value={form.applicationDeadline} onChange={handleChange} className="border rounded px-3 py-2 text-sm" />
        </div>

        <div className="flex gap-3 pt-2">
          <button disabled={saving} className="bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-full text-sm disabled:opacity-60">
            {saving ? "Posting..." : "Post Job"}
          </button>
          <button type="button" onClick={() => navigate("/employer")} className="text-sm text-gray-500">Cancel</button>
        </div>
      </form>
    </div>
  );
}
