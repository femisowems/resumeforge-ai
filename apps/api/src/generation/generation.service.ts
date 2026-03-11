import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GenerationService {
  private readonly logger = new Logger(GenerationService.name);

  constructor(@InjectQueue('generation') private generationQueue: Queue) {}

  async queueGeneration(resumeText: string, jobDescription: string) {
    const jobId = uuidv4();
    
    // In a real app we'd fetch the resume text from DB using a resumeId.
    // For this example, we'll pass the text directly.
    await this.generationQueue.add('forge', {
      resumeText,
      jobDescription,
      jobId
    }, {
      jobId, // Unique BullMQ job ID
    });

    this.logger.log(`Queued generation job ${jobId}`);

    return { jobId, status: 'queued' };
  }
}
