import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import JobCard from "../components/JobCard.jsx";
import Loader from "../components/Loader.jsx";
import { Search, MapPin, ArrowRight, Briefcase, Users, Building2 } from "lucide-react";

const categories = ["Software & IT", "Marketing", "Sales", "Design", "Finance & Accounting", "Customer Support", "Human Resources", "Operations"];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/jobs/featured").then((res) => setFeatured(res.data)).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="font-display font-800 text-3xl md:text-5xl leading-tight mb-4">
            Find Your <span className="text-accent-400">Dream Job</span> Today
          </h1>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Thousands of jobs from top companies across Pakistan — apply in minutes.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-white rounded-full p-1.5 flex flex-col md:flex-row gap-1 shadow-cardHover">
            <div className="flex-1 flex items-center gap-2 px-4 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title or keyword"
                className="w-full text-sm text-ink focus:outline-none"
              />
            </div>
            <div className="flex-1 flex items-center gap-2 px-4 py-2 border-t md:border-t-0 md:border-l border-gray-100">
              <MapPin size={18} className="text-gray-400" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City (e.g. Lahore)"
                className="w-full text-sm text-ink focus:outline-none"
              />
            </div>
            <button className="bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-full transition">
              Search
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[[Briefcase, "1,200+", "Active Jobs"], [Building2, "300+", "Companies"], [Users, "20,000+", "Job Seekers"]].map(([Icon, num, label], idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Icon size={22} className="text-accent-400" />
                <div className="text-left">
                  <p className="font-display font-700 text-lg">{num}</p>
                  <p className="text-xs text-primary-200">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-display font-700 text-xl md:text-2xl mb-6 text-center">Popular Categories</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((c) => (
            <Link
              key={c}
              to={`/jobs?category=${encodeURIComponent(c)}`}
              className="text-sm font-medium bg-white border border-gray-200 rounded-full px-4 py-2 hover:border-primary-500 hover:text-primary-700 transition"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-700 text-xl md:text-2xl">Latest Job Openings</h2>
          <Link to="/jobs" className="text-sm text-primary-700 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-primary-800 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="font-display font-700 text-xl md:text-2xl mb-3">Are You Hiring?</h2>
          <p className="text-primary-200 mb-6 max-w-md mx-auto">Post your job for free and reach thousands of qualified candidates today.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-ink font-semibold px-6 py-3 rounded-full transition">
            Post a Job <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
