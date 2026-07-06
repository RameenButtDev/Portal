import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import { Briefcase, Users, Building2, FileText } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => setData(res.data));
  }, []);

  if (!data) return <Loader />;

  const cards = [
    { label: "Active Jobs", value: data.activeJobs, icon: Briefcase, color: "bg-green-100 text-green-700" },
    { label: "Total Applications", value: data.totalApplications, icon: FileText, color: "bg-blue-100 text-blue-700" },
    { label: "Job Seekers", value: data.totalJobSeekers, icon: Users, color: "bg-purple-100 text-purple-700" },
    { label: "Employers", value: data.totalEmployers, icon: Building2, color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-card p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${c.color}`}>
              <c.icon size={20} />
            </div>
            <p className="text-xl font-bold">{c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-card p-5">
          <h3 className="font-semibold mb-4 text-sm">Applications by Status</h3>
          <div className="space-y-2">
            {data.applicationsByStatus.map((s) => (
              <div key={s._id} className="flex justify-between text-sm">
                <span>{s._id}</span>
                <span className="font-medium">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-5">
          <h3 className="font-semibold mb-4 text-sm">Top Employers by Job Postings</h3>
          <div className="space-y-2">
            {data.topEmployers.map((e, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{e._id}</span>
                <span className="font-medium">{e.jobCount} jobs</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
