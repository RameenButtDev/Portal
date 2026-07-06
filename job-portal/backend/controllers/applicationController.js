import asyncHandler from "express-async-handler";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

// @desc Apply to a job (jobseeker)
// @route POST /api/applications
export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter, resumeUrl } = req.body;

  const job = await Job.findById(jobId);
  if (!job || !job.isActive) {
    res.status(404);
    throw new Error("Job not found or no longer active");
  }

  const resume = resumeUrl || req.user.resumeUrl;
  if (!resume) {
    res.status(400);
    throw new Error("Please upload a resume before applying");
  }

  const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
  if (existing) {
    res.status(400);
    throw new Error("You have already applied to this job");
  }

  const application = await Application.create({
    job: jobId,
    applicant: req.user._id,
    employer: job.employer,
    resumeUrl: resume,
    coverLetter,
  });

  res.status(201).json(application);
});

// @desc Get logged-in jobseeker's applications
// @route GET /api/applications/myapplications
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate("job", "title companyName location jobType salaryMin salaryMax slug isActive")
    .sort({ createdAt: -1 });
  res.json(applications);
});

// @desc Withdraw an application
// @route DELETE /api/applications/:id
export const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }
  if (application.applicant.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }
  await application.deleteOne();
  res.json({ message: "Application withdrawn" });
});

// ---------- EMPLOYER ----------

// @desc Get applicants for a specific job (employer, own job only)
// @route GET /api/applications/job/:jobId
export const getApplicantsForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  if (job.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view applicants for this job");
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate("applicant", "name email phone headline skills experienceYears location resumeUrl")
    .sort({ createdAt: -1 });

  res.json(applications);
});

// @desc Update application status (employer)
// @route PUT /api/applications/:id/status
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }
  if (application.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }
  application.status = req.body.status || application.status;
  const updated = await application.save();
  res.json(updated);
});

// ---------- SAVED JOBS ----------

// @desc Toggle save/unsave a job (jobseeker)
// @route POST /api/applications/saved/:jobId
export const toggleSavedJob = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const jobId = req.params.jobId;
  const index = user.savedJobs.findIndex((j) => j.toString() === jobId);

  if (index > -1) {
    user.savedJobs.splice(index, 1);
  } else {
    user.savedJobs.push(jobId);
  }
  await user.save();
  res.json({ savedJobs: user.savedJobs });
});

// @desc Get saved jobs for logged-in jobseeker
// @route GET /api/applications/saved
export const getSavedJobs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "savedJobs",
    match: { isActive: true },
  });
  res.json(user.savedJobs);
});
