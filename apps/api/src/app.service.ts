import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'ResumeForge AI API',
      status: 'online',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
  }
}
