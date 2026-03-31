import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    
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

export const handler = async (req: any, res: any) => {
  const server = await bootstrap();
  return server(req, res);
};

// Only listen locally, skip when running as a Vercel function
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT ?? 3001;
  bootstrap().then(async (expressApp) => {
    expressApp.listen(port, () => {
      console.log(`\nAPI is running on http://localhost:${port}/api\n`);
    });
  });
}
