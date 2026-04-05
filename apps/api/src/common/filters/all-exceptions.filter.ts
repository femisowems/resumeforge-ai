import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ErrorPersonalizer } from '../utils/error-personalizer';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException 
      ? exception.getResponse() 
      : { message: (exception as Error).message || 'Internal server error' };

    const message = typeof exceptionResponse === 'object' && (exceptionResponse as any).message
      ? (exceptionResponse as any).message
      : (exception as Error).message || 'Internal server error';

    // Get user from request if available for personalization
    const user = (request as any).user;
    
    // Personalize the error message
    const { friendlyMessage, originalMessage } = ErrorPersonalizer.personalize(message, status, user);

    this.logger.error(`Exception: ${status} - ${originalMessage}`, (exception as Error).stack);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: originalMessage,
      friendlyMessage: friendlyMessage,
    });
  }
}

