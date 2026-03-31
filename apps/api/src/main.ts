import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    
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
    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

const port = process.env.PORT || 3001;

async function startServer() {
  const server = await bootstrap();
  // Vercel handles the listener, but on Railway/Docker we must call listen()
  if (process.env.VERCEL !== '1') {
    server.listen(port, '0.0.0.0', () => {
      console.log(`\n🚀 API is running on http://0.0.0.0:${port}/api\n`);
    });
  }
}

export const handler = async (req: any, res: any) => {
  const server = await bootstrap();
  return server(req, res);
};

startServer();
