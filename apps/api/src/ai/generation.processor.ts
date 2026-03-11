import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AiService } from './ai.service';
// In a real app we'd inject DocumentsService to save the results

@Processor('generation')
export class GenerationProcessor extends WorkerHost {
  private readonly logger = new Logger(GenerationProcessor.name);

  constructor(private readonly aiService: AiService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id}`);
    
    // Start timing
    const start = Date.now();
    try {
      const { resumeText, jobDescription, jobId } = job.data;
      
      this.logger.log(`Job ${jobId}: Forging resume...`);
      const result = await this.aiService.forgeResume(resumeText, jobDescription);
      
      // We would save the result to the database here
      this.logger.log(`Job ${jobId}: Finished in ${Date.now() - start}ms`);
      
      return result;
    } catch (error) {
      this.logger.error(`Job ${job.id} failed`, error.stack);
      throw error;
    }
  }
}
