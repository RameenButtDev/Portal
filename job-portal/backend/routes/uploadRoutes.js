import express from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dest = file.fieldname === "logo" ? "uploads/logos/" : "uploads/resumes/";
    cb(null, dest);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    const allowed = /pdf|docx?|msword/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) return cb(null, true);
    return cb(new Error("Only PDF or Word documents are allowed for resumes"));
  }
  const allowedImg = /jpe?g|png|webp/;
  const ext = allowedImg.test(path.extname(file.originalname).toLowerCase());
  if (ext) return cb(null, true);
  cb(new Error("Only image files (jpg, png, webp) are allowed for logos"));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/resume", protect, upload.single("resume"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ url: `/uploads/resumes/${req.file.filename}` });
});

router.post("/logo", protect, upload.single("logo"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ url: `/uploads/logos/${req.file.filename}` });
});

export default router;
