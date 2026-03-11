import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { GenerationService } from './generation.service';

@Controller('generation')
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Post('start')
  async startGeneration(@Body() body: { resumeText: string; jobDescription: string }) {
    if (!body.resumeText || !body.jobDescription) {
      throw new BadRequestException('resumeText and jobDescription are required');
    }

    return this.generationService.queueGeneration(body.resumeText, body.jobDescription);
  }
}
