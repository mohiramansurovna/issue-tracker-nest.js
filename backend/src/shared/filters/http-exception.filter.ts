import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  private readonly logFilePath = path.join(
    process.cwd(),
    'logs',
    'server-error.log',
  );

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.resolveMessage(exception, isHttpException, status);
    const path = request.originalUrl || request.url;
    const method = request.method;
    const timestamp = new Date().toISOString();

    if (status >= 500) {
      this.logger.error(
        `[${timestamp}] ${method} ${path} -> ${message}`,
        isHttpException ? undefined : (exception as Error)?.stack,
      );
      this.appendToFile(`[${timestamp}] ${method} ${path} -> ${message}\n\n\n`);
    }

    response.status(status).json({
      message,
    });
  }

  private appendToFile(line: string) {
    try {
      fs.mkdirSync(path.dirname(this.logFilePath), { recursive: true });
      fs.appendFileSync(this.logFilePath, line, { encoding: 'utf8' });
    } catch {
      // Avoid throwing from the error handler itself
    }
  }

  private resolveMessage(
    exception: unknown,
    isHttpException: boolean,
    status: number,
  ): string {
    if (isHttpException) {
      const response = (exception as HttpException).getResponse();
      if (typeof response === 'string') return response;
      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        const message = (response as { message?: string | string[] }).message;
        if (Array.isArray(message)) return message.join(', ');
        if (typeof message === 'string') return message;
      }
      return (exception as HttpException).message;
    }

    if (exception instanceof Error && exception.message) {
      return exception.message;
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      return 'Internal server error';
    }

    return 'Unexpected error';
  }
}
