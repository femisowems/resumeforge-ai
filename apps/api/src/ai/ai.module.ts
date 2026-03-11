import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerationProcessor } from './generation.processor';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [DocumentsModule],
  providers: [AiService, GenerationProcessor],
  exports: [AiService],
})
export class AiModule {}
