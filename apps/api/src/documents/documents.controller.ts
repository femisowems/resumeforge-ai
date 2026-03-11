import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get(':id')
  async getDocument(@Param('id') id: string) {
    const doc = await this.documentsService.getById(id);
    if (!doc) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return doc;
  }
}
