import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: [
      'https://resumeforge.ssowemimo.com',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`\n🚀 API is running on http://0.0.0.0:${port}/api\n`);
}

// Vercel Serverless Handler
let cachedHandler: any;
async function bootstrapServerless() {
  if (!cachedHandler) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.enableCors({
      origin: ['https://resumeforge.ssowemimo.com', 'http://localhost:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    app.setGlobalPrefix('api');
    await app.init();
    cachedHandler = expressApp;
  }
  return cachedHandler;
}

export const handler = async (req: any, res: any) => {
  const server = await bootstrapServerless();
  return server(req, res);
};

// Start standard server if not on Vercel
if (process.env.VERCEL !== '1') {
  bootstrap();
}
