import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'MISSING_API_KEY',
    });
  }

  async forgeResume(resumeText: string, jobDescription: string): Promise<{
    optimizedText: string;
    matchScore: number;
    insights: string;
  }> {
    this.logger.log('Starting Gemini API call to forge resume...');

    const prompt = `
You are an expert AI Resume Writer and Recruiter. Your task is to optimize a candidate's resume for a specific job description. Ensure the resume passes Applicant Tracking Systems (ATS) and highlights relevant experience.

Original Resume Text:
${resumeText}

Target Job Description:
${jobDescription}

Please provide the output in JSON format with three exact keys:
- "optimizedText": The rewritten resume content, preserving professional formatting using Markdown.
- "matchScore": An integer from 0 to 100 representing how well the original resume matches the job description.
- "insights": A brief two-sentence explanation of what key improvements you made to align with the job description.
`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const text = response.text || "{}";
      const result = JSON.parse(text);

      this.logger.log('Gemini optimization successful.');

      return {
        optimizedText: result.optimizedText || 'Error generating text.',
        matchScore: result.matchScore || 50,
        insights: result.insights || 'No insights available.',
      };
    } catch (error) {
      this.logger.error('Error calling Gemini API', error);
      throw error;
    }
  }
}
