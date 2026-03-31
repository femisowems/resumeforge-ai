import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  const port = process.env.PORT ?? 3001;
  try {
    await app.listen(port);
  } catch (error: any) {
    if (error.code === 'EADDRINUSE') {
      console.error(`\nCRITICAL ERROR: Port ${port} is already in use.`);
      console.error(`Please run 'lsof -i :${port}' and kill the process using 'kill -9 <PID>'.\n`);
      process.exit(1);
    }
    throw error;
  }
}
bootstrap();
