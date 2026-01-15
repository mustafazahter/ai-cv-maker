import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ResumeData, AgentResponse, ChatMessage, GeminiModel } from "../types";

// Inner Schema for the Resume Data
const resumeSchemaProps = {
  fullName: { type: Type.STRING },
  title: { type: Type.STRING },
  email: { type: Type.STRING },
  phone: { type: Type.STRING },
  location: { type: Type.STRING },
  website: { type: Type.STRING },
  linkedin: { type: Type.STRING },
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
        items: { type: Type.ARRAY, items: { type: Type.STRING } },
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
  interests: {
    type: Type.ARRAY,
    items: { type: Type.STRING }
  },
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
    experience: data.experience || [],
    education: data.education || [],
    skills: data.skills || [],
    projects: data.projects || [],
    certifications: data.certifications || [],
    languages: data.languages || [],
    volunteering: data.volunteering || [],
    awards: data.awards || [],
    interests: data.interests || [],
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
    You are an expert Resume Data Extractor.
    
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
    USER REQUEST:
    ${userMessage}

    IMPORTANT: If the request contains CV data, perform a FULL information replacement.
  `;

  console.log(">>> [LOG] prompt length:", fullPrompt.length);
  parts.push({ text: fullPrompt });

  try {
    console.log(">>> [LOG] About to call generateContent...");
    console.log(">>> [LOG] Model:", modelName);
    console.log(">>> [LOG] Contents Format Fix Applied.");

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: parts }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: agentSchema,
        temperature: 0.9,
      },
    });

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
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log(">>> Failed to parse text:", cleanText.substring(0, 500) + "...");
      throw new Error("Failed to parse AI response.");
    }

    // SPEED OPTIMIZATION HANDLING:
    let finalResumeData = currentResume;

    if (parsed.updatedResume && Object.keys(parsed.updatedResume).length > 2) { // length > 2 usually means more than just fullName/title
      console.log(">>> [LOG] Full Update Detected. Merging...");
      console.log(">>> [LOG] AI Provided Experience count:", parsed.updatedResume.experience?.length || 0);

      // Merge logic
      const mergedResume = {
        ...currentResume,
        ...parsed.updatedResume,
        // Explicitly overwrite arrays to prevent accidental merging of old/new lists
        experience: parsed.updatedResume.experience || currentResume.experience,
        education: parsed.updatedResume.education || currentResume.education,
        skills: parsed.updatedResume.skills || currentResume.skills,
        sectionOrder: parsed.updatedResume.sectionOrder || currentResume.sectionOrder,
      };
      finalResumeData = sanitizeResumeData(mergedResume);
    } else if (parsed.updatedResume && Object.keys(parsed.updatedResume).length > 0) {
      console.log(">>> [LOG] Partial Update (likely name only). Fields:", Object.keys(parsed.updatedResume));
      const mergedResume = { ...currentResume, ...parsed.updatedResume };
      finalResumeData = sanitizeResumeData(mergedResume);
    } else {
      console.log(">>> [LOG] Performance Mode: Chat only response.");
    }

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