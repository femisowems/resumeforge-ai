import { Injectable, Logger } from '@nestjs/common';
import { generateObject, LanguageModel } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { z } from 'zod';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  // Helper method to resolve available models in order of priority
  private getAvailableModels(requestedProvider?: string): { id: string; model: LanguageModel }[] {
    const models: { id: string; model: LanguageModel }[] = [];

    // Optional override order
    const preferredProvider = (requestedProvider && requestedProvider !== 'auto') 
      ? requestedProvider.toLowerCase() 
      : process.env.AI_PROVIDER?.toLowerCase();

    const gatewayUrl = process.env.VERCEL_AI_GATEWAY_URL;

    const loadProvider = (providerStr: string) => {
      // Check for available keys to avoid instantiating invalid models
      if (providerStr === 'openai' && process.env.OPENAI_API_KEY) {
        const openai = createOpenAI({ 
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: gatewayUrl ? `${gatewayUrl}/openai` : undefined
        });
        models.push({ id: 'openai (gpt-4o-mini)', model: openai('gpt-4o-mini') });
      }
      if (providerStr === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
        const anthropic = createAnthropic({ 
          apiKey: process.env.ANTHROPIC_API_KEY,
          baseURL: gatewayUrl ? `${gatewayUrl}/anthropic` : undefined
        });
        models.push({ id: 'anthropic (claude-3-5-sonnet-latest)', model: anthropic('claude-3-5-sonnet-latest') });
      }
      if (providerStr === 'google' && process.env.GEMINI_API_KEY) {
        const google = createGoogleGenerativeAI({ 
          apiKey: process.env.GEMINI_API_KEY,
          baseURL: gatewayUrl ? `${gatewayUrl}/google-generative-ai` : undefined
        });
        models.push({ id: 'google (gemini-2.5-flash)', model: google('gemini-2.5-flash') });
      }
      if (providerStr === 'deepseek' && process.env.DEEPSEEK_API_KEY) {
        const deepseek = createDeepSeek({ 
          apiKey: process.env.DEEPSEEK_API_KEY,
          baseURL: gatewayUrl ? `${gatewayUrl}/deepseek` : undefined
        });
        models.push({ id: 'deepseek (deepseek-chat)', model: deepseek('deepseek-chat') });
      }
    };

    // Load the explicitly preferred provider first, if configured
    if (preferredProvider) {
      loadProvider(preferredProvider);
    }

    // Load remaining providers as fallbacks (order of general reliability for JSON extraction)
    if (preferredProvider !== 'openai') loadProvider('openai');
    if (preferredProvider !== 'anthropic') loadProvider('anthropic');
    if (preferredProvider !== 'deepseek') loadProvider('deepseek');
    if (preferredProvider !== 'google') loadProvider('google');

    // If no API keys were found at all, add a dummy model that will error properly
    if (models.length === 0) {
      const fallback = createOpenAI({ apiKey: 'MISSING_API_KEY' });
      models.push({ id: 'fallback-missing-key', model: fallback('gpt-4o-mini') });
    }

    return models;
  }

  async forgeResume(
    resumeText: string, 
    jobDescription: string,
    requestedProvider?: string,
    onWarning?: (warning: string) => void | Promise<void>
  ): Promise<{
    optimizedText: string;
    matchScore: number;
    insights: string;
    aiModel: string;
  }> {
    this.logger.log('Starting AI API call to forge resume...');

    const prompt = `
You are an expert AI Resume Writer and Recruiter. Your task is to optimize a candidate's resume for a specific job description. Ensure the resume passes Applicant Tracking Systems (ATS) and highlights relevant experience.

Original Resume Text:
${resumeText}

Target Job Description:
${jobDescription}

LENGTH TARGET: 
Aim for a comprehensive content depth that naturally fills exactly TWO full pages. Ensure your descriptions are detailed enough to provide value while remaining professional and punchy to maintain reader engagement across the two pages.

CRITICAL FORMATTING INSTRUCTION:
The very first line of the "optimizedText" output MUST be the candidate's first and last name formatted as an H1 markdown header (e.g., "# John Doe"). The contact information MUST appear on the lines below the name. Do NOT put the name and contact info on the same line.
`;

    const models = this.getAvailableModels(requestedProvider);
    let lastError: any = null;

    // Retry loop through all configured/available providers
    for (const { id, model } of models) {
      try {
        this.logger.log(`Attempting generation with model provider: ${id}...`);

        const { object } = await generateObject({
          model: model,
          schema: z.object({
            optimizedText: z.string().describe('The rewritten resume content, preserving professional formatting using Markdown.'),
            matchScore: z.number().min(0).max(100).describe('An integer from 0 to 100 representing how well the original resume matches the job description.'),
            insights: z.string().describe('A brief two-sentence explanation of what key improvements you made to align with the job description.'),
          }),
          prompt: prompt,
        });

        this.logger.log(`AI optimization successful via ${id}.`);
        return { ...object, aiModel: id };

      } catch (error: any) {
        this.logger.warn(`Model API ${id} failed. Attempting fallback if available. Error: ${error.message}`);
        lastError = error;
        if (onWarning) {
          try {
            await onWarning(`Provider ${id} unavailable. Switching to fallback AI...`);
          } catch (cbError) {
             this.logger.error('Failed to execute onWarning callback', cbError);
          }
        }
      }
    }

    // If we land here, all attempts failed across all available providers
    this.logger.error('All AI providers exhausted and failed', lastError?.stack);
    
    let errorMessage = 'Failed to generate resume optimization. All fallback providers are exhausted or out of service.';
    
    // Attempt to stringify clean error messages if the API returned JSON inside the error message
    let parsedApiError = lastError?.message;
    try {
      if (parsedApiError && parsedApiError.startsWith('{')) {
        const parsed = JSON.parse(parsedApiError);
        parsedApiError = parsed.error?.message || parsed.message || parsedApiError;
      }
    } catch(e) {}

    if (lastError?.statusCode === 429 || lastError?.status === 429 || lastError?.statusCode === 503 || lastError?.status === 503 || lastError?.statusCode === 401 || lastError?.status === 401 || lastError?.statusCode === 403 || lastError?.status === 403) {
      errorMessage = 'All configured AI providers failed (high demand, quota exceeded, or invalid keys). Please check your API keys or try again later.';
    } else if (parsedApiError) {
      errorMessage = `All AI providers failed. Final API Error: ${parsedApiError}`;
    }
    
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).status = lastError?.statusCode || lastError?.status || 500;
    throw enhancedError;
  }
}
