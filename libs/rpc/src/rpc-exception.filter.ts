import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';
import { RpcErrorPayload } from '@app/rpc/rpc.types';

@Catch()
export class RpcExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    if (exception instanceof RpcException) return super.catch(exception, host);

    const status = exception?.getStatus?.();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (status === 400) {
      const payload: RpcErrorPayload = {
        code: 'VALIDATION_ERROR',
        message: 'Validation error',
        details: response,
      };
      return super.catch(new RpcException(payload), host);
    }

    const payload: RpcErrorPayload = {
      code: 'INTERNAL',
      message: 'Internal error',
    };
    return super.catch(new RpcException(payload), host);
  }
}
