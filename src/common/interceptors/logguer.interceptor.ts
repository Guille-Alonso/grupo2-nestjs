import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
<<<<<<< HEAD
import { catchError, tap, throwError } from 'rxjs';
=======
import { tap } from 'rxjs';
>>>>>>> origin/dev

@Injectable()
export class LogguerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      tap((data) => {
        const date = new Date();
        const formatDate = date.toLocaleString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        console.log(
          'Request: ',
          request.url,
          request.method,
          response.statusCode,
          formatDate,
        );
        console.log('Response:', data);
      }),
<<<<<<< HEAD
      catchError((error) => {
        const date = new Date();
        const formatDate = date.toLocaleString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        console.log(
          'Request: ',
          request.url,
          request.method,
          response.statusCode,
          formatDate,
        );
        console.log('Response:', error);
        return throwError(() => error);
      }),
=======
>>>>>>> origin/dev
    );
  }
}
