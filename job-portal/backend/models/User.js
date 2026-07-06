import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, default: "" },
    role: { type: String, enum: ["jobseeker", "employer", "admin"], default: "jobseeker" },
    isActive: { type: Boolean, default: true },

    // Job seeker fields
    headline: { type: String, default: "" }, // e.g. "Frontend Developer"
    bio: { type: String, default: "" },
    skills: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    resumeUrl: { type: String, default: "" },
    location: { type: String, default: "" },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

    // Employer fields
    companyName: { type: String, default: "" },
    companyLogo: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    companyDescription: { type: String, default: "" },
    companyIndustry: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
