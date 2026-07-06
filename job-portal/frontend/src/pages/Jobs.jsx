import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import JobCard from "../components/JobCard.jsx";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { SlidersHorizontal } from "lucide-react";

const categories = ["Software & IT", "Marketing", "Sales", "Design", "Finance & Accounting", "Customer Support", "Human Resources", "Operations", "Other"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Manager"];

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState([]);
  const { userInfo } = useAuth();

  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";
  const jobType = searchParams.get("jobType") || "";
  const experienceLevel = searchParams.get("experienceLevel") || "";

  const loadSaved = async () => {
    if (userInfo?.role !== "jobseeker") return;
    const { data } = await api.get("/applications/saved");
    setSavedIds(data.map((j) => j._id));
  };

  useEffect(() => { loadSaved(); }, [userInfo]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/jobs", {
          params: { keyword, location, category, jobType, experienceLevel, page },
        });
        setJobs(data.jobs);
        setPages(data.pages);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [keyword, location, category, jobType, experienceLevel, page]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display font-700 text-2xl">
          {keyword ? `Results for "${keyword}"` : "Browse Jobs"}
        </h1>
        <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-1 text-sm border rounded-full px-3 py-1.5">
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-56 flex-shrink-0 space-y-6`}>
          <div>
            <h3 className="font-semibold text-sm mb-2">Category</h3>
            <div className="space-y-1">
              <button onClick={() => updateParam("category", "")} className={`block text-sm ${!category ? "text-primary-700 font-semibold" : "text-gray-600"}`}>All</button>
              {categories.map((c) => (
                <button key={c} onClick={() => updateParam("category", c)} className={`block text-sm text-left ${category === c ? "text-primary-700 font-semibold" : "text-gray-600"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2">Job Type</h3>
            <select value={jobType} onChange={(e) => updateParam("jobType", e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm">
              <option value="">All Types</option>
              {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2">Experience Level</h3>
            <select value={experienceLevel} onChange={(e) => updateParam("experienceLevel", e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm">
              <option value="">Any Level</option>
              {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2">Location</h3>
            <input
              defaultValue={location}
              onBlur={(e) => updateParam("location", e.target.value)}
              placeholder="City"
              className="w-full border rounded px-2 py-1.5 text-sm"
            />
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <Loader />
          ) : jobs.length === 0 ? (
            <p className="text-gray-500 py-10 text-center">No jobs found matching your criteria.</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-5">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} savedIds={savedIds} onToggleSaved={loadSaved} />
                ))}
              </div>
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-full text-sm ${page === p ? "bg-primary-700 text-white" : "bg-white border text-gray-600"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
