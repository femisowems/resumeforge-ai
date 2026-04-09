import { AiService } from './src/ai/ai.service';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const service = new AiService();
  
  // Override logger to see everything
  Logger.overrideLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  
  try {
    const result = await service.forgeResume(
      "Software Engineer with 2 years of experience in React and Node.js. Developed several web applications.",
      "Looking for a Full Stack Developer with 3+ years of experience in React, Node.js, and AWS.",
      undefined,
      (warning) => console.log('WARNING CALLBACK:', warning)
    );
    console.log('SUCCESS:', result);
  } catch (error) {
    console.error('FINAL ERROR:', error);
  }
}

main();
