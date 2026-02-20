import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ResumeData, AgentResponse, ChatMessage, GeminiModel } from "@/shared/types";

// Inner Schema for the Resume Data
const resumeSchemaProps = {
  fullName: { type: Type.STRING },
  title: { type: Type.STRING },
  email: { type: Type.STRING },
  phone: { type: Type.STRING },
  location: { type: Type.STRING },
  website: { type: Type.STRING },
  linkedin: { type: Type.STRING },
  github: { type: Type.STRING },
  summary: { type: Type.STRING },
  sectionOrder: {
    type: Type.ARRAY,
    items: { type: Type.STRING },
    description: "The order of sections to display. Default keys: summary, experience, education, skills, projects, certifications, languages, volunteering, awards, interests, references."
  },
  experience: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        company: { type: Type.STRING },
        title: { type: Type.STRING },
        location: { type: Type.STRING },
        startDate: { type: Type.STRING },
        endDate: { type: Type.STRING },
        current: { type: Type.BOOLEAN },
        description: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
  },
  education: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        institution: { type: Type.STRING },
        degree: { type: Type.STRING },
        location: { type: Type.STRING },
        startDate: { type: Type.STRING },
        endDate: { type: Type.STRING },
        current: { type: Type.BOOLEAN },
      },
    },
  },
  skills: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        showLevel: { type: Type.BOOLEAN },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              level: { type: Type.NUMBER }
            }
          }
        },
      },
    },
  },
  projects: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        description: { type: Type.ARRAY, items: { type: Type.STRING } },
        url: { type: Type.STRING },
        startDate: { type: Type.STRING },
        endDate: { type: Type.STRING },
      }
    }
  },
  certifications: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        issuer: { type: Type.STRING },
        date: { type: Type.STRING },
        url: { type: Type.STRING },
      }
    }
  },
  languages: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        language: { type: Type.STRING },
        proficiency: { type: Type.STRING },
      }
    }
  },
  volunteering: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        organization: { type: Type.STRING },
        role: { type: Type.STRING },
        location: { type: Type.STRING },
        startDate: { type: Type.STRING },
        endDate: { type: Type.STRING },
        current: { type: Type.BOOLEAN },
        description: { type: Type.ARRAY, items: { type: Type.STRING } },
      }
    }
  },
  awards: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        issuer: { type: Type.STRING },
        date: { type: Type.STRING },
        description: { type: Type.STRING },
      }
    }
  },
  interests: { type: Type.STRING },
  customSections: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              date: { type: Type.STRING },
              description: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
          }
        }
      }
    }
  },
  references: { type: Type.STRING },
};

// Outer Schema - OPTIMIZED: updatedResume is now OPTIONAL
const agentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    thoughts: { type: Type.STRING },
    chatResponse: { type: Type.STRING },
    updatedResume: {
      type: Type.OBJECT,
      properties: resumeSchemaProps,
      required: ["fullName"], // This is only required IF updatedResume is provided
    }
  },
  // CRITICAL CHANGE: 'updatedResume' is NOT in the required list anymore.
  // This allows the model to skip generating the huge JSON object for simple chat messages.
  required: ["thoughts", "chatResponse"],
};

export interface FileAttachment {
  base64: string;
  mimeType: string;
}

const sanitizeResumeData = (data: ResumeData): ResumeData => {
  const cleanField = (val: string | undefined): string => {
    if (!val) return "";
    let clean = val;
    if (!val.match(/^\(\d{3}\)/)) {
      clean = clean.replace(/\s*\(.*?(added|guess|extracted|unknown|provide|blank).*?\)\s*/gi, '');
    }
    clean = clean.replace(/[*]*\s*Note:.*$/i, '');
    return clean.trim();
  };

  return {
    ...data,
    email: cleanField(data.email),
    phone: cleanField(data.phone),
    location: cleanField(data.location),
    website: cleanField(data.website),
    linkedin: cleanField(data.linkedin),
    github: cleanField(data.github),
    experience: data.experience || [],
    education: data.education || [],
    skills: data.skills || [],
    projects: data.projects || [],
    certifications: data.certifications || [],
    languages: data.languages || [],
    volunteering: data.volunteering || [],
    awards: data.awards || [],
    interests: data.interests || "",
    customSections: data.customSections || [],
  };
};

export const chatWithCVAgent = async (
  apiKey: string,
  modelName: GeminiModel,
  userMessage: string,
  currentResume: ResumeData,
  history: ChatMessage[],
  attachment?: FileAttachment
): Promise<AgentResponse> => {
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  const historyContext = history
    .filter(msg => msg.role !== 'system')
    .map(msg => `${msg.role.toUpperCase()}: ${msg.content} ${msg.thoughts ? `(Thoughts: ${msg.thoughts})` : ''}`)
    .join('\n');

  // Check if the current resume is still the initial template (John Doe)
  const isTemplateData = currentResume.fullName === "John Doe" && currentResume.email === "john.doe@example.com";

  // If it's the template, send empty state so AI doesn't use placeholder values
  const stateToSend = isTemplateData ? {} : currentResume;

  // SYSTEM INSTRUCTION: CRITICAL - DATA EXTRACTION FOCUSED
  const systemInstruction = `
    You are an expert Resume Data Extractor and ATS Optimization Specialist.
    
    **MODE DETECTION:**
    - If the user is just chatting (greeting, question) -> Return ONLY 'thoughts' and 'chatResponse'.
    - If the user provides CV/resume text or asks for changes -> Return 'thoughts', 'chatResponse', AND 'updatedResume'.

    **EXTRACTION RULES (CRITICAL):**
    1. **EXTRACT FROM USER INPUT**: If the user provides CV text, extract ALL information from it. Do NOT use any placeholder data.
    2. **EXPERIENCE EXTRACTION**: Parse ALL job entries. Each job = { id, company, title, location, startDate, endDate, current, description[] }.
    3. **CONTACT EXTRACTION**: Use EXACTLY the phone/email the user provides.
    4. **CREATE URLS**: If user mentions "LinkedIn" or "GitHub" without URLs, create plausible ones based on the user's name.
    5. **LANGUAGE**: Match the user's language.
    6. **IDs**: Generate unique IDs for each entry (e.g., "exp-1", "edu-1", "custom-1").

    **ATS KEYWORD OPTIMIZATION (VERY IMPORTANT):**
    When creating or updating a CV, you MUST optimize content for ATS (Applicant Tracking Systems):
    1. **Industry Keywords**: Add relevant technical skills, tools, and industry-standard terminology.
    2. **Action Verbs**: Use strong action verbs (Led, Developed, Implemented, Optimized, Managed, Designed, Achieved, etc.)
    3. **Quantifiable Achievements**: Include metrics and numbers where possible (e.g., "Increased sales by 25%", "Managed team of 10").
    4. **Job-Specific Terms**: If the user mentions a target role/industry, include relevant keywords for that field.
    5. **Skills Section**: Ensure the skills section includes both hard skills (technical) and soft skills that ATS systems scan for.
    6. **Standard Section Headers**: Use standard headers like "Experience", "Education", "Skills" for better ATS parsing.
    8. **SKILL LEVELS (IMPORTANT)**: 
         - If the user explicitly mentions skill levels (e.g., "Expert in React", "Advanced Python"), enable levels for that category by setting "showLevel": true.
         - Map levels to a 1-5 scale: Beginner=1, Elementary=2, Intermediate=3, Advanced=4, Expert=5.
         - If NO level is mentioned, set "showLevel": false and default level to 3.
         - Structure: { "name": "Tech Stack", "showLevel": true, "items": [{ "name": "React", "level": 5 }] }

    9. **Avoid**: Graphics, tables, special characters that ATS cannot parse (you're generating text data, so this is handled).
    
    Always inform the user in your 'chatResponse' about the ATS keywords you've added or optimized.

    **CUSTOM SECTIONS:**
    For non-standard sections (e.g., "Publications", "Hobbies", "Awards", "Achievements"), use the 'customSections' array:
    customSections: [
      {
        id: "custom-section-1",
        title: "Section Name (e.g., Publications, Achievements)",
        items: [
          {
            id: "item-1",
            title: "Item Title",
            subtitle: "Optional Role or Detail",
            date: "Optional Date (e.g., 2024)",
            description: ["Description line 1", "Description line 2"]
          }
        ]
      }
    ]
    When adding a custom section, also add its key to 'sectionOrder' array.

    CURRENT CV STATE (Empty if user hasn't created one yet):
    ${JSON.stringify(stateToSend)}
  `;

  console.log(">>> Gemini Request Prompt:", userMessage);
  console.log(">>> Using Model:", modelName);
  console.log(">>> History Count:", history.length);

  const parts: any[] = [];

  if (attachment) {
    const cleanBase64 = attachment.base64.replace(/^data:(.*);base64,/, "");
    parts.push({
      inlineData: {
        data: cleanBase64,
        mimeType: attachment.mimeType,
      },
    });
  }

  const fullPrompt = `
    PREVIOUS CHAT HISTORY:
    ${historyContext || "No previous history."}

    ---

    CURRENT USER REQUEST:
    ${userMessage}

    IMPORTANT: If the request contains CV data, perform a FULL information replacement.
  `;

  console.log(">>> [LOG] prompt length:", fullPrompt.length);
  parts.push({ text: fullPrompt });

  try {
    console.log(">>> [LOG] About to call generateContent...");
    console.log(">>> [LOG] Model:", modelName);

    // --- MODEL SPECIFIC CONFIGURATION STRATEGY ---

    // Common JSON Instruction for models effectively using "Prompt Mode"
    const PROMPT_JSON_INSTRUCTION = `
        
        **CRITICAL JSON FORMAT - YOU MUST FOLLOW THIS EXACTLY:**
        {
          "thoughts": "your internal reasoning about the request",
          "chatResponse": "your friendly response to the user",
          "updatedResume": {
            "fullName": "EXACT name from user input - REQUIRED",
            "title": "Professional title",
            "email": "email from user input",
            "phone": "phone from user input",
            "location": "location from user input",
            "website": "website if provided",
            "linkedin": "linkedin URL",
            "github": "github URL",
            "summary": "professional summary text",
            "sectionOrder": ["summary", "experience", "education", "skills", ...],
            "experience": [{ "id": "exp-1", "company": "...", "title": "...", "location": "...", "startDate": "...", "endDate": "...", "current": true/false, "description": ["bullet 1", "bullet 2"] }],
            "education": [{ "id": "edu-1", "institution": "...", "degree": "...", "location": "...", "startDate": "...", "endDate": "..." }],
            "skills": [{ 
                "name": "Category Name", 
                "showLevel": true, 
                "items": [{ "name": "Skill Name", "level": 1-5 }] 
            }],
            "languages": [{ "id": "lang-1", "language": "...", "proficiency": "..." }],
            "awards": [{ "id": "award-1", "title": "...", "issuer": "...", "date": "...", "description": "..." }],
            "certifications": [],
            "projects": [],
            "volunteering": [],
            "interests": "",
            "customSections": [],
            "references": ""
          }
        }
        
        **IMPORTANT**: The "fullName" field is REQUIRED and must contain the person's name from the CV text.
        DO NOT include any text outside the JSON object. Respond ONLY with valid JSON.
    `;

    let generationConfig: any = {};
    let finalSystemInstruction = systemInstruction;
    let timeoutMs = 60000; // Default

    // 1. GEMINI 3 / THINKING (Advanced)
    if (modelName.includes('gemini-3') || modelName.includes('thinking')) {
      console.log(">>> [CONFIG] Using Advanced/Thinking Config (Prompt-based JSON, Low Temp)");
      timeoutMs = 120000; // 120s
      generationConfig = {
        temperature: 0.7,
      };
      finalSystemInstruction += PROMPT_JSON_INSTRUCTION;
    }
    // 2. FLASH LITE (Lightweight)
    else if (modelName.includes('lite')) {
      console.log(">>> [CONFIG] Using Flash Lite Config (Prompt-based JSON, Med Temp)");
      // NOTE: We use Prompt-based JSON for Lite too, because strict Schema enforcement 
      // on complex nested objects can sometimes timeout or confuse smaller models.
      timeoutMs = 90000; // 90s
      generationConfig = {
        temperature: 0.8, // Slightly higher creative freedom
      };
      finalSystemInstruction += PROMPT_JSON_INSTRUCTION;
    }
    // 3. FLASH 2.5 / STANDARD (Standard)
    else {
      console.log(">>> [CONFIG] Using Standard Flash Config (PROMPT-BASED JSON, Med Temp)");
      // CHANGED: User reported Native Schema timeouts for 2.5 Flash. 
      // Switching to Prompt-based JSON for consistency and speed.
      timeoutMs = 90000; // 90s
      generationConfig = {
        temperature: 0.8,
        // Removed responseSchema to prevent validation timeouts
      };
      finalSystemInstruction += PROMPT_JSON_INSTRUCTION;
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Model timeout after ${timeoutMs / 1000}s - Try a different model`)), timeoutMs);
    });

    const apiPromise = ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: parts }],
      config: {
        systemInstruction: finalSystemInstruction,
        ...generationConfig
      },
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);

    console.log(">>> [LOG] generateContent call returned.");

    const text = response.text;
    console.log(">>> Raw AI Response length:", text?.length || 0);

    if (!text) throw new Error("No response from Gemini");

    let cleanText = text.replace(/```json\s*/g, "").replace(/```/g, "").trim();
    const firstOpenBrace = cleanText.indexOf('{');
    const lastCloseBrace = cleanText.lastIndexOf('}');

    if (firstOpenBrace !== -1 && lastCloseBrace !== -1 && lastCloseBrace > firstOpenBrace) {
      cleanText = cleanText.substring(firstOpenBrace, lastCloseBrace + 1);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleanText);
      console.log(">>> Parsed JSON Success. Fields:", Object.keys(parsed));
      console.log(">>> updatedResume exists:", !!parsed.updatedResume);
      if (parsed.updatedResume) {
        console.log(">>> updatedResume fullName:", parsed.updatedResume.fullName);
        console.log(">>> updatedResume keys:", Object.keys(parsed.updatedResume));
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log(">>> Failed to parse text:", cleanText.substring(0, 500) + "...");
      throw new Error("Failed to parse AI response.");
    }

    // SPEED OPTIMIZATION HANDLING:
    let finalResumeData = currentResume;

    if (parsed.updatedResume && Object.keys(parsed.updatedResume).length > 2) { // length > 2 usually means more than just fullName/title
      console.log(">>> [LOG] Full Update Detected. Replacing CV data...");
      console.log(">>> [LOG] AI Provided Experience count:", parsed.updatedResume.experience?.length || 0);
      console.log(">>> [LOG] AI Provided fullName:", parsed.updatedResume.fullName);

      // FULL REPLACE - AI data takes priority, only use currentResume for missing fields
      const aiData = parsed.updatedResume;
      const mergedResume: ResumeData = {
        fullName: aiData.fullName || currentResume.fullName,
        title: aiData.title || currentResume.title,
        email: aiData.email || currentResume.email,
        phone: aiData.phone || currentResume.phone,
        location: aiData.location || currentResume.location,
        website: aiData.website || currentResume.website,
        linkedin: aiData.linkedin || currentResume.linkedin,
        github: aiData.github || currentResume.github,
        summary: aiData.summary || currentResume.summary,
        profileImage: aiData.profileImage || currentResume.profileImage,
        sectionOrder: aiData.sectionOrder || currentResume.sectionOrder,
        experience: aiData.experience || [],
        education: aiData.education || [],
        skills: aiData.skills || [],
        projects: aiData.projects || [],
        certifications: aiData.certifications || [],
        languages: aiData.languages || [],
        volunteering: aiData.volunteering || [],
        awards: aiData.awards || [],
        interests: aiData.interests || "",
        customSections: aiData.customSections || [],
        references: aiData.references || currentResume.references,
      };
      finalResumeData = sanitizeResumeData(mergedResume);
    } else if (parsed.updatedResume && Object.keys(parsed.updatedResume).length > 0) {
      console.log(">>> [LOG] Partial Update. Fields:", Object.keys(parsed.updatedResume));
      const mergedResume = { ...currentResume, ...parsed.updatedResume };
      finalResumeData = sanitizeResumeData(mergedResume);
    } else {
      console.log(">>> [LOG] Performance Mode: Chat only response.");
    }

    console.log(">>> [LOG] Final Resume fullName:", finalResumeData.fullName);
    console.log(">>> [LOG] Final Resume experience count:", finalResumeData.experience?.length || 0);

    return {
      thoughts: parsed.thoughts || "",
      chatResponse: parsed.chatResponse || "",
      updatedResume: finalResumeData
    };

  } catch (error: any) {
    console.error(">>> [CRITICAL] Gemini API Exception:", error);
    if (error.response) {
      console.error(">>> [CRITICAL] Response Data:", error.response);
    }
    if (error.message) {
      console.error(">>> [CRITICAL] Error Message:", error.message);
    }
    throw error;
  }
};