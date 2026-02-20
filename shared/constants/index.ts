import { ResumeData } from "@/shared/types";

export const INITIAL_RESUME_DATA_EN: ResumeData = {
  fullName: "John Doe",
  title: "Software Engineer",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  location: "New York, NY",
  website: "johndoe.dev",
  linkedin: "linkedin.com/in/johndoe",
  github: "github.com/johndoe",
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
      items: [
        { name: "JavaScript", level: 5 },
        { name: "TypeScript", level: 5 },
        { name: "React", level: 5 },
        { name: "Node.js", level: 4 },
        { name: "Python", level: 4 },
        { name: "AWS", level: 3 }
      ]
    }
  ],
  projects: [],
  certifications: [],
  languages: [],
  volunteering: [],
  awards: [],
  interests: "",
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

export const INITIAL_RESUME_DATA_TR: ResumeData = {
  fullName: "Ahmet Yılmaz",
  title: "Yazılım Mühendisi",
  email: "ahmet.yilmaz@ornek.com",
  phone: "(555) 123-4567",
  location: "İstanbul, Türkiye",
  website: "ahmetyilmaz.dev",
  linkedin: "linkedin.com/in/ahmetyilmaz",
  github: "github.com/ahmetyilmaz",
  summary: "Ölçeklenebilir web uygulamaları geliştirme konusunda güçlü bir geçmişe sahip, sonuç odaklı Yazılım Mühendisi. Etkileşimli ve kullanıcı odaklı çözümler oluşturmak için full-stack teknolojilerden yararlanma konusunda kanıtlanmış yetenek. Yüksek kaliteli kod ve sürekli öğrenmeye adanmış.",
  experience: [
    {
      id: "exp-1",
      company: "Teknoloji Çözümleri A.Ş.",
      title: "Kıdemli Geliştirici",
      location: "İstanbul",
      startDate: "Oca 2020",
      endDate: "Devam Ediyor",
      current: true,
      description: [
        "Çekirdek ürün mimarisini yeniden tasarlayan 5 kişilik bir ekibe liderlik ederek performansı %40 artırdı.",
        "GitHub Actions kullanarak CI/CD süreçlerini uyguladı, dağıtım süresini %60 azalttı.",
        "Kod kalitesi standartlarını sağlamak için genç geliştiricilere mentorluk yaptı ve kod incelemeleri gerçekleştirdi."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "İstanbul Teknik Üniversitesi",
      degree: "Bilgisayar Mühendisliği Lisans",
      location: "İstanbul",
      startDate: "Eyl 2015",
      endDate: "May 2019",
      current: false
    }
  ],
  skills: [
    {
      name: "Teknik Yetkinlikler",
      items: [
        { name: "JavaScript", level: 5 },
        { name: "TypeScript", level: 5 },
        { name: "React", level: 5 },
        { name: "Node.js", level: 4 },
        { name: "Python", level: 4 },
        { name: "AWS", level: 3 }
      ]
    }
  ],
  projects: [],
  certifications: [],
  languages: [],
  volunteering: [],
  awards: [],
  interests: "",
  customSections: [],
  references: "İstek üzerine sağlanabilir.",

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

export const getInitialResumeData = (lang: string): ResumeData => {
  return lang === 'tr' ? INITIAL_RESUME_DATA_TR : INITIAL_RESUME_DATA_EN;
};

// Backwards compatibility for now, default to English if used directly, but App.tsx should use getInitialResumeData
export const INITIAL_RESUME_DATA = INITIAL_RESUME_DATA_EN;