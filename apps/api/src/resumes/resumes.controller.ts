import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumesService } from './resumes.service';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('resume'))
  async uploadResume(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Resume file is required');
    }

    const text = await this.resumesService.extractText(file);
    
    // In a real app we would save to DB and S3 here.
    return {
      message: 'Resume parsed successfully',
      parsedTextLength: text.length,
      // We could return a resumeId for subsequent generation calls
      resumeId: 'mock-resume-id-' + Date.now(),
      textPreview: text.substring(0, 500)
    };
  }
}
