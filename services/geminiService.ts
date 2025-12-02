import { GoogleGenAI } from "@google/genai";
import { JobPosting } from "../types";

// Note: In a real production environment, we would use a backend proxy.
// For this architecture demo, we assume the environment variable is available.
// If process.env.API_KEY is not set, this will fail gracefully in the UI.

const apiKey = process.env.API_KEY || ''; 
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const getJobInsight = async (job: JobPosting): Promise<string> => {
  if (!ai) {
    return "AI Service Unavailable: API Key missing. Please configure process.env.API_KEY.";
  }

  try {
    const prompt = `
      Analyze this job posting for the Bangladeshi market context.
      
      Job Title: ${job.title}
      Company: ${job.company.name} (${job.company.tags.join(', ')})
      Salary: ${job.salary.min} - ${job.salary.max} ${job.salary.currency}
      Location: ${job.location.area}, ${job.location.city}
      
      Provide a 2-sentence insight about whether this is a competitive offer for a Senior Engineer in Dhaka and highlight one key pro of the company.
      Keep it professional and concise.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate insight.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to analyze job posting. Please try again later.";
  }
};