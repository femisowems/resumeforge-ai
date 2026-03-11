import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumesService } from './resumes.service';
import { GenerationService } from '../generation/generation.service';

@Controller('resumes')
export class ResumesController {
  constructor(
    private readonly resumesService: ResumesService,
    private readonly generationService: GenerationService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('resume'))
  async uploadResume(
    @UploadedFile() file: Express.Multer.File,
    @Body('jobDescription') jobDescription: string
  ) {
    if (!file) {
      throw new BadRequestException('Resume file is required');
    }
    if (!jobDescription) {
      throw new BadRequestException('Job description is required');
    }

    const text = await this.resumesService.extractText(file);
    
    // Kick off the generation queue with the parsed text
    const queueResult = await this.generationService.queueGeneration(text, jobDescription);

    return {
      message: 'Resume parsing and generation queued successfully',
      parsedTextLength: text.length,
      jobId: queueResult.jobId,
      status: queueResult.status
    };
  }
}
