import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    companyLogo: { type: String, default: "" },
    description: { type: String, required: true },
    responsibilities: { type: String, default: "" },
    requirements: { type: String, default: "" },
    location: { type: String, required: true },
    isRemote: { type: Boolean, default: false },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
      default: "Full-time",
    },
    category: {
      type: String,
      enum: [
        "Software & IT",
        "Marketing",
        "Sales",
        "Design",
        "Finance & Accounting",
        "Customer Support",
        "Human Resources",
        "Operations",
        "Other",
      ],
      default: "Other",
    },
    experienceLevel: {
      type: String,
      enum: ["Entry Level", "Mid Level", "Senior Level", "Manager"],
      default: "Entry Level",
    },
    skills: [{ type: String }],
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    salaryPeriod: { type: String, enum: ["Monthly", "Yearly"], default: "Monthly" },
    applicationDeadline: { type: Date },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true }, // admin can moderate
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", skills: "text" });

export default mongoose.model("Job", jobSchema);
