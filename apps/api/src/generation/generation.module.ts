import { Module } from '@nestjs/common';
import { GenerationController } from './generation.controller';
import { GenerationService } from './generation.service';
import { BullModule } from '@nestjs/bullmq';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [
    DocumentsModule,
    BullModule.registerQueue({
      name: 'generation',
    }),
  ],
  controllers: [GenerationController],
  providers: [GenerationService],
  exports: [GenerationService]
})
export class GenerationModule {}
