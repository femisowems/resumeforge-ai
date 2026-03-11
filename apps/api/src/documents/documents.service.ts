import { Injectable } from '@nestjs/common';
import { GenerationJob } from '@resumeforge/types';

@Injectable()
export class DocumentsService {
  // Temporary in-memory store until we set up Postgres/Prisma
  private store: Map<string, GenerationJob> = new Map();

  async getById(id: string): Promise<GenerationJob | null> {
    return this.store.get(id) || null;
  }

  saveDocument(id: string, doc: GenerationJob) {
    this.store.set(id, doc);
  }
}
