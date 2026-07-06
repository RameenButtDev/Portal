import express from "express";
import {
  getUsers, updateUser, deleteUser, getAllJobsAdmin, toggleJobApproval, getAnalytics,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, admin);

router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/jobs", getAllJobsAdmin);
router.put("/jobs/:id", toggleJobApproval);

router.get("/analytics", getAnalytics);

export default router;
