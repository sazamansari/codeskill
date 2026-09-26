import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data?: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the controller already returned an object with 'success', return it directly
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }
        // Otherwise wrap it
        return {
          success: true,
          ...(data && typeof data === 'object' ? data : { data }),
        };
      }),
    );
  }
}
