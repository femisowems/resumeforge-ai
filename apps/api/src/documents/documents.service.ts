import { Injectable, Logger } from '@nestjs/common';
import { GenerationJob } from '@resumeforge/types';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  // Temporary in-memory store until we set up Postgres/Prisma
  private store: Map<string, GenerationJob> = new Map();

  constructor() {
    this.logger.log('DocumentsService instance created');
  }

  async getById(id: string): Promise<GenerationJob | null> {
    const doc = this.store.get(id) || null;
    this.logger.log(`getById(${id}): found=${!!doc}${doc ? ` status=${doc.status}` : ''}`);
    return doc;
  }

  saveDocument(id: string, doc: GenerationJob) {
    this.logger.log(`saveDocument(${id}): status=${doc.status}`);
    this.store.set(id, doc);
  }
}
