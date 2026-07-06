import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Job from "./models/Job.js";
import Application from "./models/Application.js";

dotenv.config();
connectDB();

const makeSlug = (title) =>
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-5);

const importData = async () => {
  try {
    await Application.deleteMany();
    await Job.deleteMany();
    await User.deleteMany();

    await User.create({
      name: "Admin",
      email: "admin@jobportal.com",
      password: "admin123",
      role: "admin",
    });

    const jobseeker = await User.create({
      name: "Ahmed Raza",
      email: "jobseeker@jobportal.com",
      password: "jobseeker123",
      role: "jobseeker",
      headline: "Frontend Developer",
      bio: "Passionate frontend developer with 2 years experience in React.",
      skills: ["React", "JavaScript", "Tailwind CSS", "Git"],
      experienceYears: 2,
      location: "Lahore, Pakistan",
    });

    const employer1 = await User.create({
      name: "Sara Khan",
      email: "employer@jobportal.com",
      password: "employer123",
      role: "employer",
      companyName: "TechNova Solutions",
      companyDescription: "A fast-growing software house building web & mobile products.",
      companyIndustry: "Software & IT",
      companyWebsite: "https://technova.example.com",
    });

    const employer2 = await User.create({
      name: "Usman Ali",
      email: "employer2@jobportal.com",
      password: "employer123",
      role: "employer",
      companyName: "BrightRetail Pvt Ltd",
      companyDescription: "Retail chain expanding across Pakistan.",
      companyIndustry: "Sales",
    });

    const jobsData = [
      {
        title: "React Frontend Developer",
        employer: employer1._id,
        companyName: employer1.companyName,
        description: "We are looking for a skilled React developer to join our growing team and build modern web applications.",
        responsibilities: "Build reusable components, collaborate with designers, optimize performance.",
        requirements: "2+ years React experience, strong JavaScript fundamentals, Git knowledge.",
        location: "Lahore, Pakistan",
        isRemote: false,
        jobType: "Full-time",
        category: "Software & IT",
        experienceLevel: "Mid Level",
        skills: ["React", "JavaScript", "CSS", "REST APIs"],
        salaryMin: 80000,
        salaryMax: 150000,
        salaryPeriod: "Monthly",
      },
      {
        title: "Node.js Backend Engineer",
        employer: employer1._id,
        companyName: employer1.companyName,
        description: "Design and maintain scalable backend services powering our SaaS product.",
        responsibilities: "API design, database schema design, code reviews.",
        requirements: "Strong Node.js & MongoDB experience, understanding of REST/GraphQL.",
        location: "Remote",
        isRemote: true,
        jobType: "Full-time",
        category: "Software & IT",
        experienceLevel: "Senior Level",
        skills: ["Node.js", "MongoDB", "Express", "AWS"],
        salaryMin: 150000,
        salaryMax: 250000,
        salaryPeriod: "Monthly",
      },
      {
        title: "Digital Marketing Executive",
        employer: employer2._id,
        companyName: employer2.companyName,
        description: "Manage social media campaigns and drive online sales growth for our retail brand.",
        responsibilities: "Run paid ad campaigns, manage content calendar, analyze performance metrics.",
        requirements: "1+ years in digital marketing, experience with Meta Ads Manager.",
        location: "Karachi, Pakistan",
        isRemote: false,
        jobType: "Full-time",
        category: "Marketing",
        experienceLevel: "Entry Level",
        skills: ["SEO", "Meta Ads", "Content Marketing"],
        salaryMin: 50000,
        salaryMax: 80000,
        salaryPeriod: "Monthly",
      },
      {
        title: "UI/UX Designer (Contract)",
        employer: employer1._id,
        companyName: employer1.companyName,
        description: "Design intuitive and beautiful interfaces for our client projects on a contract basis.",
        responsibilities: "Wireframing, prototyping, user research, design systems.",
        requirements: "Portfolio required, proficiency in Figma.",
        location: "Islamabad, Pakistan",
        isRemote: true,
        jobType: "Contract",
        category: "Design",
        experienceLevel: "Mid Level",
        skills: ["Figma", "UI Design", "Prototyping"],
        salaryMin: 60000,
        salaryMax: 100000,
        salaryPeriod: "Monthly",
      },
      {
        title: "Sales Associate",
        employer: employer2._id,
        companyName: employer2.companyName,
        description: "Join our retail floor team to deliver excellent customer service and drive sales.",
        responsibilities: "Assist customers, manage inventory, achieve sales targets.",
        requirements: "Good communication skills, retail experience preferred.",
        location: "Lahore, Pakistan",
        isRemote: false,
        jobType: "Full-time",
        category: "Sales",
        experienceLevel: "Entry Level",
        skills: ["Customer Service", "Sales"],
        salaryMin: 35000,
        salaryMax: 50000,
        salaryPeriod: "Monthly",
      },
    ];

    for (const j of jobsData) {
      await Job.create({ ...j, slug: makeSlug(j.title) });
    }

    console.log("Sample data imported successfully!");
    console.log("Admin login: admin@jobportal.com / admin123");
    console.log("Job Seeker login: jobseeker@jobportal.com / jobseeker123");
    console.log("Employer login: employer@jobportal.com / employer123");
    console.log("Employer 2 login: employer2@jobportal.com / employer123");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Application.deleteMany();
    await Job.deleteMany();
    await User.deleteMany();
    console.log("All data destroyed!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") destroyData();
else importData();
