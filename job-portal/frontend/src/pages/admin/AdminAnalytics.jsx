import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#4338ca", "#f59e0b", "#3b82f6", "#a855f7", "#10b981", "#ef4444", "#ec4899"];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => setData(res.data));
  }, []);

  if (!data) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-card p-5">
        <h3 className="font-semibold mb-4 text-sm">Application Trend (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.applicationTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="_id" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#4338ca" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-card p-5">
          <h3 className="font-semibold mb-4 text-sm">Jobs by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.jobsByCategory} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={90} label>
                {data.jobsByCategory.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-card p-5">
          <h3 className="font-semibold mb-4 text-sm">Top Employers</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.topEmployers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" fontSize={12} />
              <YAxis type="category" dataKey="_id" width={120} fontSize={11} />
              <Tooltip />
              <Bar dataKey="jobCount" fill="#f59e0b" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
