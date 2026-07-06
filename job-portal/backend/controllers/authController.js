import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  headline: user.headline,
  bio: user.bio,
  skills: user.skills,
  experienceYears: user.experienceYears,
  resumeUrl: user.resumeUrl,
  location: user.location,
  companyName: user.companyName,
  companyLogo: user.companyLogo,
  companyWebsite: user.companyWebsite,
  companyDescription: user.companyDescription,
  companyIndustry: user.companyIndustry,
});

// @desc Register new user (jobseeker or employer)
// @route POST /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, companyName } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  if (role === "employer" && !companyName) {
    res.status(400);
    throw new Error("Company name is required for employer accounts");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role === "employer" ? "employer" : "jobseeker",
    companyName: role === "employer" ? companyName : "",
  });

  res.status(201).json({ ...sanitize(user), token: generateToken(user._id) });
});

// @desc Login user
// @route POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isActive) {
      res.status(403);
      throw new Error("Your account has been disabled. Contact support.");
    }
    res.json({ ...sanitize(user), token: generateToken(user._id) });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc Get logged in user's profile
// @route GET /api/auth/profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(sanitize(user));
});

// @desc Update profile
// @route PUT /api/auth/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const jobseekerFields = ["name", "phone", "headline", "bio", "skills", "experienceYears", "resumeUrl", "location"];
  const employerFields = ["name", "phone", "companyName", "companyLogo", "companyWebsite", "companyDescription", "companyIndustry"];
  const allowedFields = user.role === "employer" ? employerFields : jobseekerFields;

  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) user[f] = req.body[f];
  });
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();
  res.json({ ...sanitize(updated), token: generateToken(updated._id) });
});
