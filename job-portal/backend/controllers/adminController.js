import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// @desc Get all users
// @route GET /api/admin/users
export const getUsers = asyncHandler(async (req, res) => {
  const roleFilter = req.query.role ? { role: req.query.role } : {};
  const users = await User.find(roleFilter).select("-password").sort({ createdAt: -1 });
  res.json(users);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (req.body.isActive !== undefined) user.isActive = req.body.isActive;
  if (req.body.role) user.role = req.body.role;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role, isActive: updated.isActive });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await user.deleteOne();
  res.json({ message: "User removed" });
});

// @desc All jobs for admin moderation
// @route GET /api/admin/jobs
export const getAllJobsAdmin = asyncHandler(async (req, res) => {
  const jobs = await Job.find({}).populate("employer", "name companyName email").sort({ createdAt: -1 });
  res.json(jobs);
});

export const toggleJobApproval = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  if (req.body.isApproved !== undefined) job.isApproved = req.body.isApproved;
  if (req.body.isActive !== undefined) job.isActive = req.body.isActive;
  const updated = await job.save();
  res.json(updated);
});

// @desc Analytics summary for admin dashboard
// @route GET /api/admin/analytics
export const getAnalytics = asyncHandler(async (req, res) => {
  const totalJobSeekers = await User.countDocuments({ role: "jobseeker" });
  const totalEmployers = await User.countDocuments({ role: "employer" });
  const totalJobs = await Job.countDocuments({});
  const activeJobs = await Job.countDocuments({ isActive: true, isApproved: true });
  const totalApplications = await Application.countDocuments({});

  const applicationsByStatus = await Application.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const jobsByCategory = await Job.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const applicationTrend = await Application.aggregate([
    { $match: { createdAt: { $gte: last7Days } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topEmployers = await Job.aggregate([
    { $group: { _id: "$companyName", jobCount: { $sum: 1 } } },
    { $sort: { jobCount: -1 } },
    { $limit: 5 },
  ]);

  res.json({
    totalJobSeekers,
    totalEmployers,
    totalJobs,
    activeJobs,
    totalApplications,
    applicationsByStatus,
    jobsByCategory,
    applicationTrend,
    topEmployers,
  });
});
