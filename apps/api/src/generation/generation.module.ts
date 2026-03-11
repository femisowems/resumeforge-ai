import { Module } from '@nestjs/common';
import { GenerationController } from './generation.controller';
import { GenerationService } from './generation.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'generation',
    }),
  ],
  controllers: [GenerationController],
  providers: [GenerationService]
})
export class GenerationModule {}
