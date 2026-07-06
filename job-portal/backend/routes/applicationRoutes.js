import express from "express";
import {
  applyToJob, getMyApplications, withdrawApplication,
  getApplicantsForJob, updateApplicationStatus,
  toggleSavedJob, getSavedJobs,
} from "../controllers/applicationController.js";
import { protect, jobseeker, employer } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, jobseeker, applyToJob);
router.get("/myapplications", protect, jobseeker, getMyApplications);
router.delete("/:id", protect, jobseeker, withdrawApplication);

router.get("/saved", protect, jobseeker, getSavedJobs);
router.post("/saved/:jobId", protect, jobseeker, toggleSavedJob);

router.get("/job/:jobId", protect, employer, getApplicantsForJob);
router.put("/:id/status", protect, employer, updateApplicationStatus);

export default router;
