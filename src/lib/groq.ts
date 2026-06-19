import Groq from "groq-sdk";

const getGroqKey = () => {
  const key = process.env.GROQ_API_KEY || (import.meta as any).env?.VITE_GROQ_API_KEY || "";
  return key.trim().replace(/["']/g, ""); // Remove any accidental quotes or spaces
};

const groq = new Groq({ 
  apiKey: getGroqKey(),
  dangerouslyAllowBrowser: true // Since we are in a client-side demo environment
});

export async function generateInterviewQuestionsGroq(role: string, experience: string, jobDescription: string, resumeText?: string) {
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
 
  Return a JSON object with a "questions" key containing an array of objects, where each object has:
  - id: number
  - question: string
  - type: "technical" | "behavioral" | "managerial" | "project"
  - difficulty: "easy" | "medium" | "hard"
  - idealAnswer: string (concise, high-quality answer)
  - hint: string (small hint for "hard" questions, else empty string)`;

  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are an expert technical interviewer. Return only valid JSON." },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content || "{\"questions\": []}";
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.questions && Array.isArray(parsed.questions)) return parsed.questions;
    if (parsed.data && Array.isArray(parsed.data)) return parsed.data;
    return [];
  } catch (e) {
    console.error("Failed to parse Groq response:", e);
    return [];
  }
}

export async function generateCodingChallengeGroq(difficulty: string, language: string) {
  const prompt = `Generate 5 coding challenges for a ${difficulty} level in ${language}.
  Return a JSON object with a "challenges" key containing an array of objects, where each object has:
  - id: number
  - title: string
  - description: string
  - starterCode: string
  - solution: string
  - testCases: array of strings`;

  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are an expert coding interviewer. Return only valid JSON." },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content || "{\"challenges\": []}";
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.challenges && Array.isArray(parsed.challenges)) return parsed.challenges;
    if (parsed.data && Array.isArray(parsed.data)) return parsed.data;
    return [];
  } catch (e) {
    console.error("Failed to parse Groq response:", e);
    return [];
  }
}

export async function generateMCQsGroq(topic: string, difficulty: string) {
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

  Return a JSON object with a "questions" key containing an array of objects, where each object has:
  - id: number
  - question: string
  - passage: string (optional, only for Reading Comprehension, else empty string)
  - options: string[] (exactly 4 options)
  - idealAnswer: string (must match one of the options exactly)
  - explanation: string (a brief explanation of why the answer is correct)`;

  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are an expert quiz generator. Return only valid JSON." },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content || "{\"questions\": []}";
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.questions && Array.isArray(parsed.questions)) return parsed.questions;
    if (parsed.data && Array.isArray(parsed.data)) return parsed.data;
    return [];
  } catch (e) {
    console.error("Failed to parse Groq response:", e);
    return [];
  }
}

export async function generateInterviewSummaryGroq(questions: any[], results: any[]) {
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

  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are an expert interview performance analyzer. Return only valid JSON." },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0]?.message?.content || "{}");
}

export async function chatWithAIGroq(message: string, history: { role: "user" | "assistant", content: string }[]) {
  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant for InterviewAI. You help users with interview preparation, platform issues, and general career advice." },
      ...history,
      { role: "user", content: message }
    ],
    model: "llama-3.3-70b-versatile",
  });

  return response.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
}

export async function analyzeResumeGroq(role: string, jobDescription: string, resumeText: string) {
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
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert resume analyzer and career coach. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    
    // Ensure all required fields exist to prevent UI crashes
    return {
      matchScore: parsed.matchScore ?? 0,
      feedback: parsed.feedback ?? "Analysis unavailable.",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      spellingFixes: Array.isArray(parsed.spellingFixes) ? parsed.spellingFixes : [],
      formattingTips: Array.isArray(parsed.formattingTips) ? parsed.formattingTips : [],
      keywordsFound: Array.isArray(parsed.keywordsFound) ? parsed.keywordsFound : [],
      keywordsMissing: Array.isArray(parsed.keywordsMissing) ? parsed.keywordsMissing : [],
    };
  } catch (error) {
    console.error("Groq Resume Analysis Error:", error);
    throw error;
  }
}
