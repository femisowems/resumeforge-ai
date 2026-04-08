import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AiService } from './ai.service';
import { DocumentsService } from '../documents/documents.service';

@Processor('generation')
export class GenerationProcessor extends WorkerHost {
  private readonly logger = new Logger(GenerationProcessor.name);

  constructor(
    private readonly aiService: AiService,
    private readonly documentsService: DocumentsService
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id}`);
    
    // Start timing
    const start = Date.now();
    try {
      const { resumeText, jobDescription, jobId, aiProvider } = job.data;
      
      this.logger.log(`Job ${jobId}: Forging resume...`);
      const result = await this.aiService.forgeResume(resumeText, jobDescription, aiProvider, async (warning) => {
        const existingDoc = await this.documentsService.getById(jobId);
        if (existingDoc) {
          this.documentsService.saveDocument(jobId, { ...existingDoc, currentWarning: warning });
        }
      });
      
      this.logger.log(`Job ${jobId}: Finished in ${Date.now() - start}ms`);

      this.documentsService.saveDocument(jobId, {
        id: jobId,
        resumeId: jobId,
        jobDescription,
        status: 'completed',
        resultText: result.optimizedText,
        matchScore: result.matchScore,
        aiModel: result.aiModel,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      this.logger.error(`Job ${job.id} failed`, error.stack);
      
      const { jobId, jobDescription } = job.data;
      if (jobId) {
        this.documentsService.saveDocument(jobId, {
          id: jobId,
          resumeId: jobId,
          jobDescription,
          status: 'failed',
          resultText: 'Failed to generate resume.',
          error: error.message || 'Unknown error during generation',
          matchScore: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      throw error;
    }
  }
}
