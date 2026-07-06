import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";

export default function Profile() {
  const { userInfo, updateUserInfo } = useAuth();
  const isEmployer = userInfo.role === "employer";

  const [form, setForm] = useState({
    name: userInfo.name || "",
    phone: userInfo.phone || "",
    headline: userInfo.headline || "",
    bio: userInfo.bio || "",
    skills: (userInfo.skills || []).join(", "),
    experienceYears: userInfo.experienceYears || 0,
    location: userInfo.location || "",
    resumeUrl: userInfo.resumeUrl || "",
    companyName: userInfo.companyName || "",
    companyWebsite: userInfo.companyWebsite || "",
    companyDescription: userInfo.companyDescription || "",
    companyIndustry: userInfo.companyIndustry || "",
    companyLogo: userInfo.companyLogo || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e, field, endpoint, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append(fieldName, file);
    try {
      const { data } = await api.post(endpoint, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, [field]: data.url }));
      toast.success("Uploaded successfully");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean) };
      const { data } = await api.put("/auth/profile", payload);
      updateUserInfo(data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display font-700 text-2xl mb-6">My Profile</h1>
      <form onSubmit={submit} className="bg-white rounded-xl shadow-card p-6 space-y-4">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className="w-full border rounded px-3 py-2 text-sm" />
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full border rounded px-3 py-2 text-sm" />

        {isEmployer ? (
          <>
            <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="Company Name" className="w-full border rounded px-3 py-2 text-sm" />
            <input value={form.companyWebsite} onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })} placeholder="Company Website" className="w-full border rounded px-3 py-2 text-sm" />
            <input value={form.companyIndustry} onChange={(e) => setForm({ ...form, companyIndustry: e.target.value })} placeholder="Industry" className="w-full border rounded px-3 py-2 text-sm" />
            <textarea value={form.companyDescription} onChange={(e) => setForm({ ...form, companyDescription: e.target.value })} placeholder="Company Description" rows={4} className="w-full border rounded px-3 py-2 text-sm" />
            <div>
              <label className="text-sm font-medium block mb-2">Company Logo</label>
              {form.companyLogo && <img src={form.companyLogo} className="w-16 h-16 rounded-lg object-cover mb-2" />}
              <label className="inline-flex items-center gap-2 text-sm border rounded-full px-4 py-2 cursor-pointer hover:bg-gray-50">
                <Upload size={14} /> {uploading ? "Uploading..." : "Upload Logo"}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "companyLogo", "/upload/logo", "logo")} className="hidden" disabled={uploading} />
              </label>
            </div>
          </>
        ) : (
          <>
            <input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="Headline (e.g. Frontend Developer)" className="w-full border rounded px-3 py-2 text-sm" />
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Short Bio" rows={3} className="w-full border rounded px-3 py-2 text-sm" />
            <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Skills (comma separated: React, Node.js)" className="w-full border rounded px-3 py-2 text-sm" />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} placeholder="Years of Experience" className="border rounded px-3 py-2 text-sm" />
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Resume</label>
              {form.resumeUrl && <a href={form.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-primary-700 underline block mb-2">View current resume</a>}
              <label className="inline-flex items-center gap-2 text-sm border rounded-full px-4 py-2 cursor-pointer hover:bg-gray-50">
                <Upload size={14} /> {uploading ? "Uploading..." : "Upload Resume"}
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, "resumeUrl", "/upload/resume", "resume")} className="hidden" disabled={uploading} />
              </label>
            </div>
          </>
        )}

        <button disabled={saving} className="bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-full text-sm disabled:opacity-60">
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
