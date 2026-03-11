import { Injectable, BadRequestException } from '@nestjs/common';
const pdfParse = require('pdf-parse');
import * as mammoth from 'mammoth';

@Injectable()
export class ResumesService {
  async extractText(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const { mimetype, buffer } = file;

    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    }

    // DOCX files (using mammoth)
    if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    throw new BadRequestException('Unsupported file format. Please upload PDF or DOCX.');
  }
}
