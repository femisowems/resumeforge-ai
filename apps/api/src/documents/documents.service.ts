import { Injectable } from '@nestjs/common';
import { GenerationJob } from '@resumeforge/types';

@Injectable()
export class DocumentsService {
  async getById(id: string): Promise<GenerationJob | null> {
    // In a real application, fetch from DB (e.g. Prisma).
    // For this demonstration, return a mocked result.
    return {
      id,
      resumeId: 'mock-resume-id',
      jobDescription: 'Mock description',
      status: 'completed',
      resultText: 'This is a mocked generated resume response. The backend logic successfully completed the pipeline!',
      matchScore: 92,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}
