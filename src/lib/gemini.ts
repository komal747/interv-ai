import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = () => {
  const key = (process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || "").trim().replace(/["']/g, "");
  
  if (key && !key.startsWith("AIza")) {
    console.warn("Warning: Your Gemini API key does not start with 'AIza'. This usually means it is not a valid Gemini API key.");
  }
  
  return key;
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export async function generateInterviewQuestions(role: string, experience: string, jobDescription: string, resumeText?: string) {
  const prompt = `Generate 5 highly targeted interview questions for a ${role} position.
  Experience Level: ${experience}
  Job Description: ${jobDescription}
  ${resumeText ? `Candidate Resume: ${resumeText}` : ""}
  
  CRITICAL: For any questions involving money, salary, or currency, use Indian Rupees (₹) instead of dollars ($).
  
  CRITICAL GUIDELINES:
  - If a resume is provided, ensure at least 2 questions are specific to the PROJECTS or EXPERIENCES listed in the resume.
  - Include a mix of:
    - Technical questions (based on role and JD)
    - Behavioral questions (e.g., "Tell me about a time when...")
    - Managerial/Situational questions (especially for Intermediate/Expert levels)
  
  ROLE-SPECIFIC FOCUS:
  - Data Analytics: SQL, statistical analysis, visualization.
  - Backend: API design, DB optimization, architecture.
  - Frontend: React, CSS performance, state management.
  - Business Analyst: Requirement gathering, stakeholder management.

  Return the questions in a JSON array of objects, where each object has:
  - id: number
  - question: string
  - type: "technical" | "behavioral" | "managerial" | "project"
  - difficulty: "easy" | "medium" | "hard"
  - idealAnswer: string (concise, high-quality answer)
  - hint: string (small hint for "hard" questions, else empty string)`;

  const response = await ai.models.generateContent({
    model: "models/gemini-1.5-pro",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.NUMBER },
            question: { type: Type.STRING },
            type: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            idealAnswer: { type: Type.STRING },
            hint: { type: Type.STRING },
          },
          required: ["id", "question", "type", "difficulty", "idealAnswer", "hint"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]");
}

export async function generateCodingChallenge(difficulty: string, language: string) {
  const prompt = `Generate 5 coding challenges for a ${difficulty} level in ${language}.
  Return a JSON array of objects, where each object has:
  - id: number
  - title: string
  - description: string
  - starterCode: string
  - solution: string
  - testCases: array of strings`;

  const response = await ai.models.generateContent({
    model: "models/gemini-1.5-pro",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.NUMBER },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            starterCode: { type: Type.STRING },
            solution: { type: Type.STRING },
            testCases: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["id", "title", "description", "starterCode", "solution", "testCases"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]");
}

export async function evaluateAnswer(question: string, answer: string) {
  const prompt = `Evaluate the following interview answer:
  Question: ${question}
  Answer: ${answer}
  
  Provide feedback in a JSON object with:
  - score: number (0-10)
  - feedback: string
  - improvements: array of strings`;

  const response = await ai.models.generateContent({
    model: "models/gemini-1.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["score", "feedback", "improvements"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function generateMCQs(topic: string, difficulty: string) {
  const prompt = `Generate 5 Multiple Choice Questions (MCQs) for the topic: ${topic}.
  Difficulty Level: ${difficulty} (If Fresher: focus on fundamentals. If Expert: focus on complex, advanced scenarios and edge cases).
  
  CRITICAL: For any questions involving money or currency (especially in Quantitative Aptitude), use Indian Rupees (₹) instead of dollars ($).
  
  Topics to cover if applicable:
  - Quantitative Aptitude (math, logic, numbers - vary complexity based on ${difficulty})
  - Verbal Ability (grammar, comprehension, vocabulary - MUST include at least one Reading Comprehension question if the topic is general or verbal focused)
  - Logical Reasoning (patterns, deductions, puzzles - vary complexity based on ${difficulty})
  - Technical Knowledge (CS fundamentals, specific technologies)
  
  FOR READING COMPREHENSION: 
  - Provide a short passage (100-150 words).
  - The question must be based on the passage.
  - Set the "passage" field in the JSON for these questions.

  Return the questions in a JSON array of objects, where each object has:
  - id: number
  - question: string
  - passage: string (optional, only for Reading Comprehension, else empty string)
  - options: string[] (exactly 4 options)
  - idealAnswer: string (must match one of the options exactly)
  - explanation: string (a brief explanation of why the answer is correct)`;

  const response = await ai.models.generateContent({
    model: "models/gemini-1.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.NUMBER },
            question: { type: Type.STRING },
            passage: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            idealAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["id", "question", "options", "idealAnswer", "explanation", "passage"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]");
}

export async function generateInterviewSummary(questions: any[], results: any[]) {
  const prompt = `Analyze the following interview performance and provide a summary.
  
  Questions and Answers:
  ${questions.map((q, i) => {
    const result = results.find(r => r.questionId === q.id) || results[i];
    return `Q${i+1}: ${q.question || q.title}\nA${i+1}: ${result?.answer || "No answer provided."}`;
  }).join("\n\n")}
  
  CRITICAL: Be genuine and objective.
  - High Confidence: Response is technically correct, articulate, and covers key concepts.
  - Medium Confidence: Response is mostly correct but lacks depth or has minor inaccuracies.
  - Low Confidence: Response is vague, mostly incorrect, or irrelevant.
  
  Do NOT give fake strengths.
  
  Return a JSON object with:
  - overallScore: number (0-100)
  - confidenceLevel: "Low" | "Medium" | "High"
  - strengths: array of strings (max 3)
  - growthAreas: array of strings (max 3)
  - summary: string (a brief overview of the performance)`;

  const response = await ai.models.generateContent({
    model: "models/gemini-1.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          confidenceLevel: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          growthAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
        },
        required: ["overallScore", "confidenceLevel", "strengths", "growthAreas", "summary"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function chatWithAI(message: string, history: { role: "user" | "model", content: string }[]) {
  const contents = [
    ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
    { role: "user", parts: [{ text: message }] }
  ];

  const response = await ai.models.generateContent({
    model: "models/gemini-1.5-flash",
    contents: contents
  });

  return response.text || "I'm sorry, I couldn't process that.";
}

export async function analyzeResume(role: string, jobDescription: string, resumeText: string) {
  const prompt = `Analyze the following resume against the job description for a ${role} position.
  
  Job Description:
  ${jobDescription}
  
  Resume:
  ${resumeText}
  
  Provide a comprehensive analysis in a JSON object with:
  - matchScore: number (0-100)
  - feedback: string (overall assessment)
  - strengths: array of strings (top 3-5 matches)
  - gaps: array of strings (missing skills or experiences)
  - improvements: array of strings (specific advice to improve the resume for this JD)
  - spellingFixes: array of objects { original: string, suggested: string } (Identify typos and offer corrections)
  - formattingTips: array of strings (advice on font size, structure, whitespace, and visual hierarchy)
  - keywordsFound: array of strings (important JD keywords found in resume)
  - keywordsMissing: array of strings (important JD keywords missing)`;

  try {
    const response = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            spellingFixes: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  suggested: { type: Type.STRING }
                },
                required: ["original", "suggested"]
              } 
            },
            formattingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywordsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywordsMissing: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["matchScore", "feedback", "strengths", "gaps", "improvements", "keywordsFound", "keywordsMissing", "spellingFixes", "formattingTips"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Resume Analysis Error:", error);
    throw error;
  }
}

