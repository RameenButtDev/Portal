import express from "express";
import {
  getJobs, getFeaturedJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs,
} from "../controllers/jobController.js";
import { protect, employer } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/featured", getFeaturedJobs);
router.get("/employer/myjobs", protect, employer, getMyJobs);
router.get("/:id", getJobById);

router.post("/", protect, employer, createJob);
router.put("/:id", protect, employer, updateJob);
router.delete("/:id", protect, employer, deleteJob);

export default router;
