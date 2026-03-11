import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerationProcessor } from './generation.processor';

@Module({
  providers: [AiService, GenerationProcessor],
  exports: [AiService],
})
export class AiModule {}
