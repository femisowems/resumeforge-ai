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
    @Body('jobDescription') jobDescription: string,
    @Body('resumeText') resumeText?: string,
  ) {
    if (!file && !resumeText) {
      throw new BadRequestException('Resume file or text is required');
    }
    if (!jobDescription) {
      throw new BadRequestException('Job description is required');
    }

    let text = resumeText;
    
    if (file) {
      text = await this.resumesService.extractText(file);
    }

    if (!text) {
      throw new BadRequestException('Could not extract text from resume');
    }
    
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
