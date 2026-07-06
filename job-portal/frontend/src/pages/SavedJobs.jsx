import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import JobCard from "../components/JobCard.jsx";
import Loader from "../components/Loader.jsx";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/applications/saved");
      setJobs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display font-700 text-2xl mb-6">Saved Jobs</h1>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No saved jobs yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} savedIds={jobs.map((j) => j._id)} onToggleSaved={load} />
          ))}
        </div>
      )}
    </div>
  );
}
