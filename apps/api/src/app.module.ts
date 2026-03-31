import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ResumesModule } from './resumes/resumes.module';
import { GenerationModule } from './generation/generation.module';
import { AiModule } from './ai/ai.module';
import { DocumentsModule } from './documents/documents.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || process.env.REDISHOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || process.env.REDISPORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || process.env.REDISPASSWORD,
        tls: (process.env.REDIS_TLS === 'true' || !!process.env.REDIS_URL?.startsWith('rediss://')) ? {} : undefined,
      },
    }),
    AuthModule,
    ResumesModule,
    GenerationModule,
    AiModule,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
