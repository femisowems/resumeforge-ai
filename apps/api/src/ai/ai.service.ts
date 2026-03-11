import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'MISSING_API_KEY',
      apiVersion: 'v1',
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
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      
      const rawText = response.text || "{}";
      this.logger.log(`Raw AI Response: ${rawText.substring(0, 500)}${rawText.length > 500 ? '...' : ''}`);

      // Robust JSON extraction: handle markdown code blocks if present
      let cleanJson = rawText.trim();
      if (cleanJson.startsWith('```')) {
        const match = cleanJson.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
          cleanJson = match[1].trim();
        }
      }

      const result = JSON.parse(cleanJson);
      this.logger.log('Gemini optimization successful.');

      return {
        optimizedText: result.optimizedText || 'Error generating text.',
        matchScore: result.matchScore || 50,
        insights: result.insights || 'No insights available.',
      };
    } catch (error: any) {
      this.logger.error('Error calling Gemini API', error.stack);
      
      let errorMessage = 'Failed to generate resume optimization.';
      
      if (error.status === 429) {
        errorMessage = 'Gemini API Quota Exceeded. Please try again later or switch models.';
      } else if (error.message && error.message.includes('JSON')) {
        errorMessage = 'AI returned an invalid response format. Please try again.';
      } else if (error.message) {
        errorMessage = `AI Error: ${error.message}`;
      }

      // Specialized debugging: attempt to list models to console
      try {
        const response = await this.ai.models.list();
        this.logger.warn('Listing available Gemini models for debugging:');
        for await (const model of response) {
          this.logger.warn(` - ${model.name}`);
        }
      } catch (listError) {
        this.logger.error('Failed to list models', listError);
      }
      
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).status = error.status;
      throw enhancedError;
    }
  }
}
