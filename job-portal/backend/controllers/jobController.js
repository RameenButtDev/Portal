import asyncHandler from "express-async-handler";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

const makeSlug = (title) =>
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-5);

// @desc Get all jobs (search/filter/pagination) - public
// @route GET /api/jobs
export const getJobs = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const filter = { isActive: true, isApproved: true };

  if (req.query.keyword) {
    filter.$or = [
      { title: { $regex: req.query.keyword, $options: "i" } },
      { companyName: { $regex: req.query.keyword, $options: "i" } },
      { skills: { $regex: req.query.keyword, $options: "i" } },
    ];
  }
  if (req.query.location) filter.location = { $regex: req.query.location, $options: "i" };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.jobType) filter.jobType = req.query.jobType;
  if (req.query.experienceLevel) filter.experienceLevel = req.query.experienceLevel;
  if (req.query.isRemote === "true") filter.isRemote = true;

  const count = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ jobs, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc Get featured/recent jobs for homepage
// @route GET /api/jobs/featured
export const getFeaturedJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ isActive: true, isApproved: true }).sort({ createdAt: -1 }).limit(6);
  res.json(jobs);
});

// @desc Get single job by slug/id (public)
// @route GET /api/jobs/:id
export const getJobById = asyncHandler(async (req, res) => {
  const query = req.params.id.match(/^[0-9a-fA-F]{24}$/) ? { _id: req.params.id } : { slug: req.params.id };
  const job = await Job.findOne(query).populate("employer", "companyName companyLogo companyWebsite companyDescription");

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  job.views += 1;
  await job.save();
  res.json(job);
});

// ---------- EMPLOYER ----------

// @desc Create a job posting
// @route POST /api/jobs
export const createJob = asyncHandler(async (req, res) => {
  const employerUser = req.user;
  const {
    title, description, responsibilities, requirements, location, isRemote, jobType,
    category, experienceLevel, skills, salaryMin, salaryMax, salaryPeriod, applicationDeadline,
  } = req.body;

  const job = await Job.create({
    title,
    slug: makeSlug(title),
    employer: employerUser._id,
    companyName: employerUser.companyName || req.body.companyName,
    companyLogo: employerUser.companyLogo || "",
    description,
    responsibilities,
    requirements,
    location,
    isRemote: !!isRemote,
    jobType,
    category,
    experienceLevel,
    skills: skills || [],
    salaryMin: salaryMin || 0,
    salaryMax: salaryMax || 0,
    salaryPeriod,
    applicationDeadline,
  });

  res.status(201).json(job);
});

// @desc Update a job (only owner employer or admin)
// @route PUT /api/jobs/:id
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  if (job.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to edit this job");
  }

  const fields = [
    "title", "description", "responsibilities", "requirements", "location", "isRemote",
    "jobType", "category", "experienceLevel", "skills", "salaryMin", "salaryMax",
    "salaryPeriod", "applicationDeadline", "isActive",
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) job[f] = req.body[f];
  });

  const updated = await job.save();
  res.json(updated);
});

// @desc Delete a job
// @route DELETE /api/jobs/:id
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  if (job.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this job");
  }
  await Application.deleteMany({ job: job._id });
  await job.deleteOne();
  res.json({ message: "Job removed" });
});

// @desc Get jobs posted by logged-in employer
// @route GET /api/jobs/employer/myjobs
export const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });

  const jobsWithCounts = await Promise.all(
    jobs.map(async (job) => {
      const applicantCount = await Application.countDocuments({ job: job._id });
      return { ...job.toObject(), applicantCount };
    })
  );

  res.json(jobsWithCounts);
});
