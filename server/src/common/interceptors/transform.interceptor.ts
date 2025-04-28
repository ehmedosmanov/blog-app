import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';
import { CustomResponse } from '../dto/custom-response.dto';
import { MESSAGE_KEY } from '../decorators/set-message.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    const req = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const customMessage = this.reflector.get<string>(MESSAGE_KEY, handler);

    return next.handle().pipe(
      map((result) => {
        const baseResponse = {
          message: customMessage || 'Operation successful',
          success: true,
          data: result?.data ?? result,
        };

        if (result?.metadata) {
          return {
            ...baseResponse,
            metadata: result.metadata,
          };
        }

        if (result instanceof CustomResponse) {
          return {
            ...baseResponse,
            message: customMessage || result.message,
          };
        }

        return baseResponse;
      }),
    );
  }
}
