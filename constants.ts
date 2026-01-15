import { ResumeData } from "./types";

export const INITIAL_RESUME_DATA: ResumeData = {
  fullName: "John Doe",
  title: "Software Engineer",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  location: "New York, NY",
  website: "johndoe.dev",
  linkedin: "linkedin.com/in/johndoe",
  summary: "Results-oriented Software Engineer with a strong background in developing scalable web applications. Proven ability to leverage full-stack technologies to build interactive and user-centric solutions. Committed to high-quality code and continuous learning.",
  experience: [
    {
      id: "exp-1",
      company: "Tech Solutions Inc.",
      title: "Senior Developer",
      location: "New York, NY",
      startDate: "Jan 2020",
      endDate: "Present",
      current: true,
      description: [
        "Led a team of 5 developers in redesigning the core product architecture, improving performance by 40%.",
        "Implemented CI/CD pipelines using GitHub Actions, reducing deployment time by 60%.",
        "Mentored junior developers and conducted code reviews to ensure code quality standards."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "State University",
      degree: "Bachelor of Science in Computer Science",
      location: "Boston, MA",
      startDate: "Sep 2015",
      endDate: "May 2019",
      current: false
    }
  ],
  skills: [
    {
      name: "Technical Skills",
      items: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS"]
    }
  ],
  projects: [],
  certifications: [],
  languages: [],
  volunteering: [],
  awards: [],
  interests: [],
  customSections: [],
  references: "Available upon request.",

  // Default Order
  sectionOrder: [
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
    "references"
  ]
};